package com.example.springapp.controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.springapp.model.Product;
import com.example.springapp.service.ReactiveSLMService;

import reactor.core.publisher.Flux;

@Controller
public class ReactiveFashionAssistantController {

    private static final Logger logger = LoggerFactory.getLogger(ReactiveFashionAssistantController.class);

    @Autowired
    private ReactiveSLMService reactiveSLMService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("products", Product.getAllProducts());
        return "index";
    }
    
    @GetMapping(value = "/reactiveQuery", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public Flux<String> processQueryReactive(
            @RequestParam("productId") int productId,
            @RequestParam("message") String message) {
        
        // Find the product
        return Flux.fromIterable(Product.getAllProducts())
                .filter(p -> p.getId() == productId)
                .take(1)
                .flatMap(product -> {
                    // Create JSON payload
                    JSONObject queryData = new JSONObject();
                    queryData.put("user_message", message);
                    queryData.put("product_name", product.getName());
                    queryData.put("product_description", product.getDescription());
                    
                    String prompt = queryData.toString();
                    
                    // Return the stream of tokens
                    return reactiveSLMService.streamChatCompletions(prompt)
                            .doOnError(e -> logger.error("Error streaming tokens to client: {}", e.getMessage(), e))
                            // Add completion event at the end
                            .concatWithValues("event: complete\n");
                })
                .switchIfEmpty(Flux.defer(() -> {
                    logger.warn("Product not found with ID: {}", productId);
                    return Flux.just("data: Product not found\n\n");
                }));
    }
}