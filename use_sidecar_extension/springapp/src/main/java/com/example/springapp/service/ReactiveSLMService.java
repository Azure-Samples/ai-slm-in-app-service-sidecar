package com.example.springapp.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

@Service
public class ReactiveSLMService {

    private final WebClient webClient;
    
    public ReactiveSLMService(@Value("${fashion.assistant.api.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();
    }
    
    public Flux<String> streamChatCompletions(String prompt) {
        // Build the request JSON
        JSONObject requestJson = new JSONObject();
        JSONArray messages = new JSONArray();
        
        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a helpful assistant.");
        messages.put(systemMessage);
        
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.put(userMessage);
        
        requestJson.put("messages", messages);
        requestJson.put("stream", true);
        requestJson.put("cache_prompt", false);
        requestJson.put("n_predict", 2048);
        
        String requestBody = requestJson.toString();
        
        return webClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(requestBody))
                .accept(MediaType.TEXT_EVENT_STREAM)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(line -> !line.equals("[DONE]") && !line.contains("event: complete"))
                .map(this::extractContentFromResponse)
                .filter(content -> content != null && !content.isEmpty())
                .map(content -> content.replace(" ", "\u00A0"));
    }
    
    private String extractContentFromResponse(String jsonResponse) {
        try {
            JSONObject responseObj = new JSONObject(jsonResponse);
            JSONArray choices = responseObj.getJSONArray("choices");
            if (choices.length() > 0) {
                JSONObject choice = choices.getJSONObject(0);
                JSONObject delta = choice.getJSONObject("delta");
                if (delta.has("content")) {
                    return delta.getString("content");
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}