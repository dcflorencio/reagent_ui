from langgraph_engineer.model import _get_model
from langgraph_engineer.state import AgentState
from typing import TypedDict
from langchain_core.messages import RemoveMessage
import json

# writer_prompt = """
# Write a detailed report on the properties. make it in markdown format
# """


# class Build_write(TypedDict):
#     report: str


# def report_writer(state: AgentState, config):
#     messages = [
#        {"role": "system", "content": writer_prompt}
#    ] + [state['messages'][-1]]
#     model = _get_model(config, "openai-mini", "report_writer").bind_tools([Build_write])
#     response = model.invoke(messages)

#     report = response.tool_calls[0]['args']['report']

#     return {"report": [report]}



# def report_writer(state: AgentState, config):
#     # Extract the last message from the state
#     last_message = state['messages'][-1]
    
#     # Print the last message
#     print("Last message:")
#     print(last_message)

#working fine!!!
# import json

# def report_writer(state: AgentState, config):
#     # Extract the last message
#     last_message = state['messages'][-1]
    
#     if hasattr(last_message, 'content') and last_message.content:
#         try:
#             # Step 1: Parse the top-level JSON string in `content`
#             content_json = json.loads(last_message.content)
            
#             # Step 2: Parse the nested JSON string in the "data" field
#             if "data" in content_json:
#                 data_json = json.loads(content_json["data"])
                
#                 # Step 3: Extract the "props" field
#                 props = data_json.get("props", None)
                
#                 if props is not None:
#                     # Output the "props" to a file
#                     output_file = "last_props_debug.json"
#                     with open(output_file, "w") as file:
#                         json.dump(props, file, indent=4)
#                     print(f"'props' saved to {output_file}")
#                 else:
#                     print("'props' not found in the 'data' field.")
#             else:
#                 print("'data' field not found in the content JSON.")
#         except json.JSONDecodeError as e:
#             print(f"JSON decoding error: {e}")
#     else:
#         print("The last message does not contain a valid 'content' field.")
    
# class Properties(TypedDict):
#     properties: list


# def report_writer(state: AgentState, config):
#     # Extract the last message
#     last_message = state['messages'][-1]
    
#     if hasattr(last_message, 'content') and last_message.content:
#         try:
#             # Step 1: Parse the top-level JSON string in `content`
#             content_json = json.loads(last_message.content)
            
#             # Step 2: Parse the nested JSON string in the "data" field
#             if "data" in content_json:
#                 data_json = json.loads(content_json["data"])
                
#                 # Step 3: Extract the "props" field
#                 props = data_json.get("props", None)
                
#                 if props is not None:
#                     # Save the props to a local file for debugging
#                     output_file = "last_props_debug.json"
#                     with open(output_file, "w") as file:
#                         json.dump(props, file, indent=4)
#                     print(f"'props' saved to {output_file}")
                    
#                     # Update the `properties` key in the state
#                     state['properties'] = props
#                 else:
#                     print("'props' not found in the 'data' field.")
#             else:
#                 print("'data' field not found in the content JSON.")
#         except json.JSONDecodeError as e:
#             print(f"JSON decoding error: {e}")
#     else:
#         print("The last message does not contain a valid 'content' field.")

def report_writer(state: dict, config):
    # Extract the last message
    last_message = state['messages'][-1]
    
    if hasattr(last_message, 'content') and last_message.content:
        try:
            # Step 1: Parse the top-level JSON string in `content`
            content_json = json.loads(last_message.content)
            
            # Step 2: Parse the nested JSON string in the "data" field
            if "data" in content_json:
                data_json = json.loads(content_json["data"])
                
                # Step 3: Extract the "props" field
                props = data_json.get("props", None)
                
                if props is not None:
                    # Save the props to a local file for debugging
                    output_file = "last_props_debug.json"
                    with open(output_file, "w") as file:
                        json.dump(props, file, indent=4)
                    print(f"'props' saved to {output_file}")
                    
                    # Update the `properties` key in the state
                    state['properties'] = props
                    
                    # Return the updated properties
                    return {"properties": props}
                else:
                    print("'props' not found in the 'data' field.")
            else:
                print("'data' field not found in the content JSON.")
        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {e}")
    else:
        print("The last message does not contain a valid 'content' field.")
    
    # Return the unchanged state in case of errors or missing data
    return {"properties": state.get('properties', [])}

