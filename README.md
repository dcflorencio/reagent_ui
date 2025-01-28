# Reagent: A Real Estate Search Assistant

![Workflow](https://github.com/dcflorencio/langgraph-reagent/blob/main/static/agent_ui_2.png)


Langgraph-Reagent is a state-of-the-art real estate search assistant that leverages the power of LangGraph and large language models (LLMs) to provide an interactive, chat-based experience for users. The application integrates real-time data from the Zillow API, making it easy for users to explore properties that match their specific requirements.

---

## Documentation

### Workflow Description

1. **__start__**: The workflow begins.
2. **gather_requirements**: Chats with user and collects property requirements from the user. Populates the `requirements` key in state.
3. **api_call_builder**: Constructs the necessary API call based on the gathered requirements. Populates `api_call_parameters` key in state.
4. **Api Call**: Executes the API call. Uses `fetch_zillow_data` tool.
5. **json_to_properties**: receives API data and populates `properties` key in state.


### Nodes
#### gather_requirements
Once the node finishes gathering all the requirements from the user it populates the `requirements` key in state. as seen below

![Gather_Requirements](https://github.com/dcflorencio/reagent_ui/blob/main/static/gather_req.JPG)

#### api_call_builder
Constructs the necessary API call based on the gathered requirements. Populates `api_call_parameters` key in state.
**However the message with the `api_call_parameters` returned by this node should not be visible to the user on the chat window.**

![Api_Parameters}](https://github.com/dcflorencio/reagent_ui/blob/main/static/api_param.JPG)

The `api_call_parameters` key can be use to display to the user the filters applied to the search, like the example below.

![Api_Parameters](https://github.com/dcflorencio/reagent_ui/blob/main/static/filter.JPG)

#### json_to_properties
Receives API data and populates `properties` key in state.

![Api_Parameters](https://github.com/dcflorencio/reagent_ui/blob/main/static/json_to_prop.JPG)

**However the message returned by this node should not be visible to the user on the chat window, only on the properties table on the right.**

### User Interface
the UI consists of a `Chat`, a `Map`, a `Properties Table` to display properties returned by the graph and a `Sidebar` to track past user sessions. the image below proides more details.

![Api_Parameters](https://github.com/dcflorencio/reagent_ui/blob/main/static/ui.JPG)

#### Chat
- Should only display the messages imporatant for the user experience, should not output messages related to internal tool calls etc. 
- Start with preset buttons: “i want to rent”, “i want to buy”
- show the filter applied after the interaction with user: #beds, baths, price, etc
- user is able to change filter and that gets passed to the chat as a message (i.e. "change the number of bathrooms to 2")
  
#### Map
- map has to adjust as the user selects properties in the right panel
- properties have to be clickable
- tool tip click shows property details
- Expandable window
- Use address or lat/lon in the `properties` key in state to get locations

#### Properties Table
Each row needs to display the data in the `properties` key:
- image, price, beds, baths, area
- address
- a “save property” button
- the image cannot be too small ( user needs to see the image well), so rows can be thicker
- Consider changing to cards instead of table if UI is not working well 
  
Requirements:
- table has to be sortable by columns
- easy way to select multiple properties
- expandable window
- as the user selects, highlight in map in different color


#### Sidebar
the sidebar has two options `History` and `Saved Properties`

**`History`**: previous chats the user had with the platform (previous threads for that user). Same as Chat GPT

**`Saved Properties`**: should show another page, just like the main one but now with the properties the user has saved in previous sessions.

we will user the chat to connect to another graph to explored the saved properties. for now you can just connect to the same graph



---
