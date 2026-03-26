import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 转发请求给 FastAPI 后端
    // 注意：Docker 环境下使用 http://backend:8000
    const backendUrl = process.env.BACKEND_URL || "http://backend:8000/api/v1/chat";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Backend error" }, { status: response.status });
    }

    // 处理流式响应
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/event-stream")) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // 处理非流式响应
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("BFF Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
