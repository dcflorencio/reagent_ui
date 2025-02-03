import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFile } from 'node:fs/promises';

(async () => {
  // Create readline interface using the newer promise-based API
  const rl = readline.createInterface({ input, output });

  // Function to make the API call
  async function makeAPICall(messages: any[]) {
    const apiResponse = await fetch(
      "https://reagent-ui-3d6ba29f3428595b8a7ab36565570117.us.langgraph.app/runs/wait",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
        },
        body: JSON.stringify({
          assistant_id: "Real Estate",
          input: { messages },
        }),
      }
    );
    return await apiResponse.json();
  }

  // Initial messages
  const messages = [
    {
      role: "user",
      content: "Can you show me some Houses to 'buy' in chicago city, illinois, US, with 2 BHK",
    },
  ];

  try {
    // Create a loop that continues until explicitly broken
    while (true) {
      // First API call
      let responseData = await makeAPICall(messages);
      
      // Save response data to file and log to console
      await writeFile('data.json', JSON.stringify(responseData, null, 2));
      console.log('Response data saved to data.json');
      // console.log("responseData", JSON.stringify(responseData, null, 2));
      
      // Format and log the main components of the response
      console.log('\n=== Response Summary ===');
      if (responseData.requirements) {
        console.log('Requirements:', responseData.requirements);
      }
      if (responseData.properties) {
        console.log('\nProperties Found:', responseData.properties.length);
        console.log('\nDetailed Property Information:');
        // responseData.properties.forEach((property: any, index: number) => {
        //   console.log(`\n=== Property ${index + 1} ===`);
        //   console.log(`Address: ${property.address}`);
        //   console.log(`Price: $${property.price.toLocaleString()}`);
        //   console.log(`Bedrooms: ${property.bedrooms}`);
        //   console.log(`Bathrooms: ${property.bathrooms}`);
        //   console.log(`Living Area: ${property.livingArea} sqft`);
        //   console.log(`Lot Area: ${property.lotAreaValue} ${property.lotAreaUnit}`);
        //   console.log(`Property Type: ${property.propertyType}`);
        //   console.log(`Listing Status: ${property.listingStatus}`);
        //   console.log(`Days on Zillow: ${property.daysOnZillow}`);
        //   console.log(`Zestimate: ${property.zestimate ? '$' + property.zestimate.toLocaleString() : 'Not available'}`);
        //   console.log(`Rent Zestimate: ${property.rentZestimate ? '$' + property.rentZestimate.toLocaleString() : 'Not available'}`);
        //   console.log(`Has 3D Model: ${property.has3DModel}`);
        //   console.log(`Has Video: ${property.hasVideo}`);
        //   console.log(`Location: ${property.latitude}, ${property.longitude}`);
        //   console.log(`Zillow Link: https://www.zillow.com${property.detailUrl}`);
        //   console.log(`Main Image: ${property.imgSrc}`);
          
        //   if (property.carouselPhotos && property.carouselPhotos.length > 0) {
        //     console.log(`\nNumber of Additional Photos: ${property.carouselPhotos.length}`);
        //   }
        // });
      }
      
      // Log all API call parameters
      if (responseData.api_call_parameters) {
        console.log('\n=== API Call Parameters ===');
        responseData.api_call_parameters.forEach((call: any) => {
          if (call.tool_calls && call.tool_calls.length > 0) {
            call.tool_calls.forEach((toolCall: any) => {
              if (toolCall.function && toolCall.function.arguments) {
                try {
                  const args = JSON.parse(toolCall.function.arguments);
                  console.log('\nFunction Name:', toolCall.function.name);
                  console.log('Arguments:', JSON.stringify(args, null, 2));
                } catch (e) {
                  console.log('Error parsing arguments:', e);
                }
              }
            });
          }
        });
      }
      
      // Log all messages with content
      if (responseData.messages) {
        console.log('\n=== All Messages ===');
        responseData.messages.forEach((message: any, index: any) => {
          console.log(`\nMessage ${index + 1}:`);
          console.log('Type:', message.type);
          console.log('Content:', message.content);
          
          // If there are tool calls in the message
          if (message.tool_calls && message.tool_calls.length > 0) {
            console.log('Tool Calls:');
            message.tool_calls.forEach((toolCall: any, toolIndex: any) => {
              console.log(`  Tool Call ${toolIndex + 1}:`);
              if (toolCall.function?.arguments) {
                try {
                  const params = JSON.parse(toolCall.function.arguments);
                  console.log(JSON.stringify(params, null, 2));
                } catch (e) {
                  console.log(toolCall.function.arguments);
                }
              }
            });
          }
        });
      }

      // Extract the last message and add to messages array
      if (responseData.messages && responseData.messages.length > 0) {
        const lastMessage = responseData.messages[responseData.messages.length - 1];
        if (lastMessage.content) {
          messages.push({
            role: "assistant",
            content: lastMessage.content
          });
          
          // Get user input
          console.log('\nPlease enter your next message (or type "exit" to quit):');
          const userInput = await rl.question('> ') as string;
          
          if (userInput.toLowerCase() === 'exit') {
            console.log('Exiting...');
            rl.close();
            return;
          }

          // Add user input to messages
          messages.push({
            role: "user",
            content: userInput
          });
          
          console.log('\n=== Making next API call with user input ===\n');
          // The loop will continue and make the next API call automatically
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
})();
