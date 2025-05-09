from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
import onnxruntime_genai as og

app = FastAPI()

# Load the ONNX model
model_path = "/app/cpu_and_mobile/cpu-int4-rtn-block-32-acc-level-4"
model = og.Model(model_path)

# Load the tokenizer from onnxruntime_genai
tokenizer = og.Tokenizer(model)
tokenizer_stream = tokenizer.create_stream()
print("Model", model)

class InputData(BaseModel):
    user_message: str
    product_name: str
    product_description: str

@app.post("/predict")
def predict(data: InputData):
    try:
        # Construct the prompt from user input
        chat_template = '<|system|>\nYou are an AI assistant that helps people find concise information about products. Keep your responses brief and focus on key points. Limit the number of product key features to no more than three.<|end|>\n<|user|>\n{input} <|end|>\n<|assistant|>'

        input = f"{data.user_message} Product: {data.product_name}. Description: {data.product_description}"
        prompt = chat_template.format(input=input)
        print("Prompt", prompt)
        input_tokens = tokenizer.encode(prompt)

        params = og.GeneratorParams(model)
        params.set_search_options(max_length=300)
        params.set_search_options(do_sample=False)
        params.input_ids = input_tokens

        print("Input tokens", input_tokens)
        generator = og.Generator(model, params)
        
        def token_generator():
            generated_text = ""
            print("Starting generator", generator.is_done())
            while not generator.is_done():
                generator.compute_logits()
                generator.generate_next_token()
                
                new_token = generator.get_next_tokens()[0]
                generated_text += tokenizer_stream.decode(new_token)
                yield tokenizer_stream.decode(new_token)
                
        return StreamingResponse(token_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))