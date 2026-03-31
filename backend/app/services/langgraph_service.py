import operator
from typing import Annotated, Sequence, TypedDict, Union, List
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from ..core.config import settings
from ..db.repository.chat_repository import ChatRepository
from uuid import UUID

class AgentState(TypedDict):
    # 使用 Annotated[..., operator.add] 来聚合消息列表
    messages: Annotated[Sequence[BaseMessage], operator.add]
    conversation_id: UUID

class LangGraphService:
    def __init__(self):
        self.model = ChatOpenAI(
            model=settings.LLM_MODEL,
            openai_api_key=settings.LLM_API_KEY,
            openai_api_base=settings.LLM_BASE_URL,
            streaming=True
        )
        self.workflow = self._create_workflow()

    def _create_workflow(self):
        workflow = StateGraph(AgentState)

        # 定义节点
        workflow.add_node("call_model", self._call_model)
        
        # 定义入口
        workflow.set_entry_point("call_model")

        # 定义边：模型调用后直接结束
        workflow.add_edge("call_model", END)

        return workflow.compile()

    async def _call_model(self, state: AgentState):
        """
        调用 LLM 节点
        """
        messages = state["messages"]
        response = await self.model.ainvoke(messages)
        return {"messages": [response]}

    async def get_response(self, conversation_id: UUID, user_input: str, history: List[BaseMessage]):
        """
        运行工作流并处理数据库持久化
        """
        # 1. 构造初始状态
        initial_state = {
            "messages": history + [HumanMessage(content=user_input)],
            "conversation_id": conversation_id
        }

        # 2. 执行工作流
        final_state = await self.workflow.ainvoke(initial_state)
        
        # 3. 获取最新的 AI 回复
        last_message = final_state["messages"][-1]
        
        return last_message.content

langgraph_service = LangGraphService()
