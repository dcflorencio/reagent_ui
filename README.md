# Langgraph-Reagent: A Real Estate Search Assistant

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



---

## Application Workflow

1. **Requirements Gathering**: The assistant collects user preferences, such as location, budget, property type, and more.
2. **API Call Construction**: Based on the gathered requirements, the system builds and executes a query to the Zillow API.
3. **Property Recommendations**: Results from the API are processed and presented to the user in an engaging chat format and a markdown report.

---

## Report

![Workflow](https://github.com/dcflorencio/langgraph-reagent/blob/main/static/report.PNG)