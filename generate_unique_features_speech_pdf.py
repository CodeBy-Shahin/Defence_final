from __future__ import annotations

from pathlib import Path
import textwrap

import fitz


OUT_DIR = Path("presentation_output")
PDF_PATH = OUT_DIR / "Smart_Commerce_Unique_Features_Speech_and_QA.pdf"
TXT_PATH = OUT_DIR / "Smart_Commerce_Unique_Features_Speech_and_QA.txt"


TITLE = "Smart Commerce - Unique Features Presentation Speech and Q&A"
SUBTITLE = "Prepared for project presentation and viva discussion"


SPEECH_PARAGRAPHS = [
    "Good morning respected supervisor, honorable guests, and everyone present here.",
    "Today, I am going to present the unique features of my project, Smart Commerce. My project is designed to make business management smarter, faster, and more reliable by using artificial intelligence, inventory intelligence, real-time analysis, and customer support automation.",
    "In many businesses, one of the biggest problems is managing products, stock, customer demand, and customer support properly. Sometimes products go out of stock. Sometimes extra products remain unsold. Sometimes the owner cannot understand which product is performing well. Also, customers may not get quick support when they have questions. These problems can reduce profit, waste time, and lower customer satisfaction.",
    "To solve these problems, I included several important and unique features in my project.",
    "The first unique feature is AI-based demand forecasting. This feature helps the system predict future product demand by analyzing previous sales data and product trends. In my project, the backend collects product and order information, prepares recent sales history, and sends it to a forecasting process. The forecasting logic checks previous sales, gives more importance to recent sales, identifies the demand trend, and estimates future demand. For example, if a product is selling more in recent days, the system can show that the demand is rising. This helps the business owner decide how much stock should be kept.",
    "The second feature is Inventory Intelligence. This feature makes inventory management smarter. A normal inventory system only stores product quantity, but my system gives more useful information. It helps the admin or vendor understand which products are available, which products are low in stock, and which products need attention. It also supports stock adjustment and keeps inventory records. Because of this, stock management becomes more controlled and easier to monitor.",
    "The third feature is the low stock alert. This feature is very important for avoiding stock-out problems. When any product quantity goes below the alert level, the system shows it as a low-stock product. The business owner can then restock the product before it becomes unavailable. This helps maintain smooth business operation and improves customer satisfaction.",
    "The fourth feature is real-time analysis. In traditional systems, business owners often need to wait for manual reports. But in my project, important information can be seen from the dashboard. The system can show updated sales, inventory status, product performance, recent orders, and other useful business data. This helps the admin make quick and accurate decisions based on the latest available information.",
    "The fifth unique feature is an AI-based customer support chatbot. Customers often ask common questions about products, orders, availability, checkout, or services. In my project, the chatbot can answer these questions instantly. It works by taking the user's question, matching it with available project knowledge and product-related information, and then giving a helpful response. This reduces pressure on the business owner and support team. It also improves customer experience because customers can get support quickly.",
    "Overall, my project is not only a simple e-commerce or inventory system. It is a smart business support system. It helps reduce manual work, saves time, improves inventory control, supports better decision-making, and gives better customer service.",
    "The main goal of this project is to make business operations easier and more intelligent. By combining demand forecasting, inventory intelligence, low stock alerts, real-time analysis, and chatbot support, this project can help a business become more efficient, organized, and customer-friendly.",
    "In the future, this project can be improved further by adding more advanced AI prediction, automatic stock reduction after order placement, supplier management, voice-based chatbot support, mobile app integration, and live notification features.",
    "Thank you for listening to my presentation. I am ready to answer your questions.",
]


QUESTIONS_AND_ANSWERS = [
    (
        "What is the main purpose of your project?",
        "The main purpose of my project is to help businesses manage products, inventory, sales, and customer support more intelligently using AI-based forecasting, dashboard analysis, and automation.",
    ),
    (
        "What makes your project different from a normal inventory system?",
        "A normal inventory system mainly stores product quantity. My project includes demand forecasting, inventory intelligence, low stock alerts, real-time dashboard analysis, and chatbot support, so it helps with both management and decision-making.",
    ),
    (
        "How did you apply demand forecasting in your project?",
        "I applied demand forecasting by using previous order and product sales data. The backend collects active products and sales history, then prepares product-wise demand information. The forecasting logic checks recent sales, uses weighted average ideas, identifies whether demand is rising or stable, and returns predicted demand for future days.",
    ),
    (
        "How does your demand forecasting feature work?",
        "It works in a few steps. First, the system reads past sales data from orders. Second, it groups sales by product. Third, it gives more importance to recent sales because recent demand is usually more useful. Fourth, it calculates expected future demand and shows the result to the admin. This helps the admin make better restocking decisions.",
    ),
    (
        "Is your demand forecasting deep learning?",
        "No, it is not deep learning. It is an explainable forecasting method based on sales history, weighted average, trend checking, and confidence scoring. I used this approach because it is easier to understand and suitable for this project level.",
    ),
    (
        "Why did you add AI-based demand forecasting?",
        "I added it to reduce guesswork in stock planning. It helps the business owner understand which products may need more stock in the future and which products may not need extra stock.",
    ),
    (
        "What is Inventory Intelligence?",
        "Inventory Intelligence means the system does more than store stock numbers. It shows stock status, low-stock products, reorder needs, stock adjustments, and inventory records so the admin or vendor can manage products more smartly.",
    ),
    (
        "How does the low stock alert help the business?",
        "Low stock alert helps the business owner know when a product quantity is becoming low. Because of this, they can restock on time and avoid losing customers due to unavailable products.",
    ),
    (
        "What do you mean by real-time analysis in your project?",
        "Real-time analysis means the dashboard shows the latest available data from the system when the page or API request is loaded. It helps the admin see updated information about sales, orders, products, and inventory without manually preparing reports.",
    ),
    (
        "How did you apply the chatbot in your project?",
        "I applied the chatbot as a customer support feature. The chatbot is connected with project knowledge and product-related information. When a user asks a question, the chatbot checks the question, matches it with known topics, and gives a relevant answer.",
    ),
    (
        "How does your chatbot work?",
        "The chatbot works by taking the user's message, processing the text, matching important words with stored knowledge, and selecting the most suitable answer. It can answer questions about products, checkout, orders, receipts, dashboards, low stock, demand forecasting, and project features.",
    ),
    (
        "Does your chatbot use ChatGPT or an external AI model?",
        "No, the current chatbot does not use ChatGPT or an external AI model. It is a rule-based and knowledge-based chatbot. It gives answers using keyword matching and prepared project information.",
    ),
    (
        "Who can use this project?",
        "Small and medium businesses, online stores, retail shops, and product-based companies can use this project to manage inventory, orders, and customers more effectively.",
    ),
    (
        "What are the future improvements of your project?",
        "Future improvements can include advanced AI prediction, automatic stock update after order placement, supplier management, voice chatbot support, mobile app integration, online payment integration, and live notification using WebSocket.",
    ),
    (
        "What did you learn from this project?",
        "I learned how to combine business management with AI-based features. I also learned about inventory control, demand prediction, dashboard analysis, customer support automation, and full-stack project development.",
    ),
]


def add_wrapped_text(
    page: fitz.Page,
    text: str,
    x: float,
    y: float,
    width: float,
    size: float,
    font: str,
    color: tuple[float, float, float] = (0.08, 0.1, 0.14),
) -> float:
    max_chars = max(35, int(width / (size * 0.47)))
    lines = textwrap.wrap(text, width=max_chars) or [""]
    line_height = size * 1.36
    for line in lines:
        page.insert_text((x, y), line, fontsize=size, fontname=font, color=color)
        y += line_height
    return y


def write_text_file() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    lines = [TITLE, SUBTITLE, "", "Presentation Speech", ""]
    lines.extend(SPEECH_PARAGRAPHS)
    lines.extend(["", "Possible Supervisor and Guest Questions with Answers", ""])
    for index, (question, answer) in enumerate(QUESTIONS_AND_ANSWERS, start=1):
        lines.append(f"{index}. Question: {question}")
        lines.append(f"Answer: {answer}")
        lines.append("")
    TXT_PATH.write_text("\n".join(lines), encoding="utf-8")


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

    add(TITLE, 17, True, after=10)
    add(SUBTITLE, 10.5, False, after=18, color=(0.32, 0.36, 0.42))

    add("Presentation Speech", 14, True, before=4, after=10)
    add("Approximate speaking time: 4 to 5 minutes", 10.5, True, after=10, color=(0.2, 0.31, 0.55))
    for paragraph in SPEECH_PARAGRAPHS:
        add(paragraph, 10.8, False, after=7, indent=8)

    add("Possible Supervisor and Guest Questions with Answers", 14, True, before=12, after=10)
    add("This Q&A section is for viva or discussion practice. It is not included in the speech timing.", 10.5, False, after=10, color=(0.32, 0.36, 0.42))

    for index, (question, answer) in enumerate(QUESTIONS_AND_ANSWERS, start=1):
        add(f"{index}. Question: {question}", 10.7, True, before=3, after=4, indent=8)
        add(f"Answer: {answer}", 10.5, False, after=7, indent=20)

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
