// Fashion Store Assistant JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const productSelect = document.getElementById('sltProduct');
    const queryTextarea = document.getElementById('txtQuery');
    const sendButton = document.getElementById('btnSend');
    const spinner = document.getElementById('spinner');
    const responseElement = document.getElementById('response');
        
    // Event listener for the send button
    sendButton.addEventListener('click', function() {
        // Validation
        const productId = productSelect.value;
        const message = queryTextarea.value.trim();
        
        if (!productId) {
            alert('Please select a product');
            return;
        }
        
        if (!message) {
            alert('Please enter a question');
            return;
        }
        
        // Reset and show spinner
        responseElement.textContent = '';
        spinner.style.display = 'flex';
        sendButton.disabled = true;
        
        const eventSource = new EventSource(`/reactiveQuery?productId=${encodeURIComponent(productId)}&message=${encodeURIComponent(message)}`);
        let fullResponse = '';
        
        // Handle incoming tokens through standard SSE events
        eventSource.onmessage = function(event) {
            if (event.data.includes('event: complete')) {
                // Stream completion detected, close the connection after a short delay
                setTimeout(() => {
                    spinner.style.display = 'none';
                    sendButton.disabled = false;
                    eventSource.close();
                }, 200);
                return;
            }
            
            // Convert non-breaking spaces to regular spaces before adding to response
            fullResponse += event.data.replace(/\u00A0/g, ' ');
            responseElement.textContent = fullResponse;
            spinner.style.display = 'none';
        };
        
        // Handle errors
        eventSource.onerror = function(event) {
            // Only show error if we haven't received any response yet
            if (!fullResponse) {
                responseElement.textContent = 'An error occurred while processing your request. Please try again.';
            }
            
            spinner.style.display = 'none';
            sendButton.disabled = false;
            eventSource.close();
        };
        
        // Auto-close after connection is established for a while (failsafe only)
        setTimeout(function() {
            if (eventSource && eventSource.readyState !== 2) { // 2 = CLOSED
                sendButton.disabled = false;
                eventSource.close();
            }
        }, 60000); // 1 minute timeout
    });
});
