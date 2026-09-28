from __future__ import annotations

from pathlib import Path
import textwrap

import fitz


OUT_DIR = Path("presentation_output")
PDF_PATH = OUT_DIR / "Smart_Commerce_Supervisor_QA.pdf"
TXT_PATH = OUT_DIR / "Smart_Commerce_Supervisor_QA.txt"


TITLE = "Smart Commerce - Supervisor Q&A"
SUBTITLE = "Inventory intelligence, low-stock alert, AI chatbot, RAG, Gemini API, and demand forecasting"


QA_ITEMS = [
    (
        "What do you mean by Inventory Intelligence? How does it work?",
        [
            "Inventory Intelligence means using product stock data, sales information, and simple analysis rules to manage inventory more smartly. A normal inventory system only stores product quantity, but my system helps the admin or vendor understand which products are available, which products are low in stock, which products are out of stock, and which products may need restocking.",
            "It works by storing stock and reorder point values for each product. The system compares the current stock with the reorder point. If the stock is zero, it shows out of stock. If the stock is less than or equal to the reorder point, it shows low stock. Otherwise, it shows in stock. This helps the business make better stock decisions instead of checking everything manually.",
        ],
    ),
    (
        "How did you implement Inventory Intelligence?",
        [
            "I implemented Inventory Intelligence by combining product stock data, reorder rules, inventory logs, dashboard alerts, and demand forecasting.",
            "In the product model, each product has stock and reorderPoint fields. The backend provides an inventory overview API that returns product name, SKU, current stock, reorder point, category, and status. The frontend displays this data in the admin and vendor inventory pages.",
            "The system also supports stock adjustment. When an admin or vendor increases or decreases stock, the system stores the previous stock, new stock, changed quantity, reason, and user information in inventory logs. Because of this, stock movement can be tracked later.",
        ],
    ),
    (
        "How is the low-stock alert given?",
        [
            "The low-stock alert is generated automatically by comparing the product's current stock with the alert threshold or reorder point.",
            "The logic is simple: if stock is zero, the system marks it as out of stock or critical. If stock is less than or equal to the reorder point, the system marks it as low stock. If stock is higher than the reorder point, it is shown as in stock.",
            "For example, if a product has stock 4 and the alert level is 7, then 4 is below 7, so the system shows a low-stock alert. This alert is shown in the admin and vendor dashboard as warning badges and low-stock product lists.",
        ],
    ),
    (
        "Which technologies are used to identify low stock and show notification?",
        [
            "For low-stock identification, I used Node.js, Express.js, TypeScript, MongoDB, and Mongoose. MongoDB stores product stock and reorder point values. The Express backend checks those values using rule-based conditions.",
            "For showing the alert or notification in the interface, I used Next.js, React, TypeScript, Tailwind CSS, badge components, dashboard alert sections, and toast messages. The notification is shown inside the web dashboard, not as SMS or email.",
            "So the backend identifies the low-stock products, and the frontend displays the alert to the admin or vendor.",
        ],
    ),
    (
        "How did you implement the AI-based customer support chatbot?",
        [
            "I implemented the chatbot as an AI-based customer support feature for the e-commerce platform. The main purpose is to answer customer questions instantly without waiting for manual support.",
            "The chatbot takes the user's natural language question, processes the text, retrieves relevant project or product information, and then generates a helpful response. It can answer questions about product availability, price, checkout, order tracking, PDF receipt, dashboard features, inventory, low-stock alert, demand forecasting, demo accounts, and setup information.",
            "This improves the customer experience because users can get quick help directly inside the platform.",
        ],
    ),
    (
        "How does the AI chatbot work?",
        [
            "The chatbot works in a few steps. First, the user types a question in the chatbot widget. Second, the question is sent to the chatbot API. Third, the system processes the text and identifies the user's intent. Fourth, it retrieves relevant context from project knowledge or product data. Finally, the AI model generates a natural answer based on that context.",
            "Because users can ask questions in normal language, the chatbot is more flexible than a fixed FAQ page. It supports customer service by answering repeated questions quickly.",
        ],
    ),
    (
        "Can you say you used RAG and Gemini API in the chatbot?",
        [
            "Yes, if the implementation includes Gemini API and retrieval-based context, I can explain it as a RAG-based AI chatbot.",
            "RAG means Retrieval-Augmented Generation. In this approach, the system first retrieves relevant information from the project knowledge base, product data, or stored support content. Then the retrieved context and the user's question are sent to the Gemini API. Gemini generates the final human-like answer using that context.",
            "Because of RAG, the chatbot does not depend only on general AI knowledge. It answers based on my own project data, which makes the response more accurate and project-specific.",
        ],
    ),
    (
        "Why did you use RAG for the chatbot?",
        [
            "I used RAG because a normal AI model can sometimes give general or incorrect answers. RAG helps the chatbot first collect relevant information from my project data and then generate the answer using that context.",
            "This makes the chatbot more reliable for customer support. For example, if the user asks about stock, checkout, low-stock alert, or demand forecast, the system can use project-specific context before generating the answer.",
        ],
    ),
    (
        "Is ChromaDB necessary to build a RAG chatbot?",
        [
            "No, ChromaDB is not mandatory for RAG. ChromaDB is only one option for storing and searching embeddings.",
            "For RAG, the main requirements are a data source, a retrieval system, an AI model, and a prompt that sends the retrieved context to the model. The data source can be MongoDB, JSON files, text files, PDFs, or a vector database.",
            "Since my project already uses MongoDB, I can retrieve relevant product and project data from MongoDB and pass that context to Gemini API. For a larger system, I can improve retrieval with ChromaDB, FAISS, Pinecone, Weaviate, PostgreSQL with pgvector, or MongoDB Atlas Vector Search.",
        ],
    ),
    (
        "What technologies did you use to implement demand forecasting?",
        [
            "For demand forecasting, I used Node.js, Express.js, TypeScript, MongoDB, Mongoose, a Python forecasting script, Next.js, React, and Recharts.",
            "The backend reads active products and previous non-cancelled orders from MongoDB. Then it groups product sales into recent weekly history. This prepared sales history is sent to a Python script. The Python script calculates predicted demand using weighted average, recent sales trend, trend labels such as rising, stable, or cooling, and a confidence score.",
            "The result is returned to the backend as JSON and displayed in the admin demand forecast page using charts and a ranking table. This helps the admin understand which products may need more stock in the future.",
        ],
    ),
    (
        "Is the demand forecasting deep learning?",
        [
            "No, my current demand forecasting is not deep learning. It is an explainable forecasting method based on previous sales history, weighted average, trend analysis, and confidence scoring.",
            "I used this approach because it is easy to explain, suitable for my project level, and useful for business decision support. In the future, it can be improved with advanced machine learning or deep learning models.",
        ],
    ),
]


def write_text_file() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    lines = [TITLE, SUBTITLE, ""]
    for index, (question, answers) in enumerate(QA_ITEMS, start=1):
        lines.append(f"{index}. Question: {question}")
        lines.append("Answer:")
        lines.extend(answers)
        lines.append("")
    TXT_PATH.write_text("\n".join(lines), encoding="utf-8")


def add_wrapped_text(
    page: fitz.Page,
    text: str,
    x: float,
    y: float,
    width: float,
    size: float,
    font: str,
    color: tuple[float, float, float],
) -> float:
    max_chars = max(35, int(width / (size * 0.47)))
    lines = textwrap.wrap(text, width=max_chars) or [""]
    line_height = size * 1.36
    for line in lines:
        page.insert_text((x, y), line, fontsize=size, fontname=font, color=color)
        y += line_height
    return y


def write_pdf() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    doc = fitz.open()
    page_w, page_h = fitz.paper_size("a4")
    margin = 54
    content_w = page_w - margin * 2
    page = doc.new_page(width=page_w, height=page_h)
    y = margin

    def new_page() -> None:
        nonlocal page, y
        page = doc.new_page(width=page_w, height=page_h)
        y = margin

    def ensure(space: float) -> None:
        if y + space > page_h - margin:
            new_page()

    def add(
        text: str,
        size: float = 10.5,
        bold: bool = False,
        before: float = 0,
        after: float = 6,
        indent: float = 0,
        color: tuple[float, float, float] = (0.08, 0.1, 0.14),
    ) -> None:
        nonlocal y
        y += before
        font = "Helvetica-Bold" if bold else "Helvetica"
        wrap_width = max(35, int((content_w - indent) / (size * 0.47)))
        line_count = max(1, len(textwrap.wrap(text, width=wrap_width)))
        ensure(line_count * size * 1.36 + after + 4)
        y = add_wrapped_text(page, text, margin + indent, y, content_w - indent, size, font, color)
        y += after

    add(TITLE, 18, True, after=10, color=(0.06, 0.12, 0.24))
    add(SUBTITLE, 10.5, False, after=18, color=(0.32, 0.36, 0.42))
    add(
        "Use these answers for supervisor questions, viva discussion, and project presentation preparation.",
        10.5,
        False,
        after=14,
        color=(0.2, 0.31, 0.55),
    )

    for index, (question, answers) in enumerate(QA_ITEMS, start=1):
        add(f"{index}. Question: {question}", 11.2, True, before=5, after=5, indent=0)
        for paragraph in answers:
            add(paragraph, 10.5, False, after=6, indent=14)

    for index, p in enumerate(doc, start=1):
        p.insert_text(
            (page_w / 2 - 8, page_h - 24),
            str(index),
            fontsize=9,
            fontname="Helvetica",
            color=(0.45, 0.45, 0.45),
        )

    doc.save(PDF_PATH)
    doc.close()


def main() -> None:
    write_text_file()
    write_pdf()
    print(PDF_PATH)
    print(TXT_PATH)


if __name__ == "__main__":
    main()
