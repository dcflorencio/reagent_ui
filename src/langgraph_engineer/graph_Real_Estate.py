from typing import Literal

from langgraph.graph import StateGraph, END, MessagesState
from langchain_core.messages import AIMessage

from langgraph.prebuilt import ToolNode



from langgraph_engineer.api_call_builder import api_call_builder, fetch_zillow_data
from langgraph_engineer.gather_requirements import gather_requirements
from langgraph_engineer.state import AgentState, OutputState, GraphConfig
from langgraph_engineer.json_to_properties import json_to_properties



def route_critique(state: AgentState) -> Literal["draft_answer", END]:
    if state['accepted']:
        return END
    else:
        return "draft_answer"

def route_check(state: AgentState) -> Literal["critique", "draft_answer"]:
    if isinstance(state['messages'][-1], AIMessage):
        return "critique"
    else:
        return "draft_answer"


def route_start(state: AgentState) -> Literal["api_call_builder", "gather_requirements"]:
    if state.get('requirements'):
        return "api_call_builder"
    else:
        return "gather_requirements"



def route_gather(state: AgentState) -> Literal["api_call_builder", END]:
    if state.get('requirements'):
        return "api_call_builder"
    else:
        return END


# Define a new graph
workflow = StateGraph(AgentState, input=MessagesState, output=OutputState, config_schema=GraphConfig)
workflow.add_node(gather_requirements)
workflow.add_node(api_call_builder)
workflow.add_node(json_to_properties)

workflow.add_node("Api Call", ToolNode([fetch_zillow_data]))
# workflow.add_node(critique)
# workflow.add_node(check)
workflow.set_conditional_entry_point(route_start)
workflow.add_conditional_edges("gather_requirements", route_gather)
# workflow.add_edge("draft_answer", "check")
# workflow.add_conditional_edges("check", route_check)
# workflow.add_conditional_edges("critique", route_critique)
workflow.add_edge("api_call_builder", "Api Call")
workflow.add_edge("Api Call", "json_to_properties")
workflow.add_edge("json_to_properties", END)


graph = workflow.compile()
