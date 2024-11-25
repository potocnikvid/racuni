import os
import fpdf
import datetime
import sys

# PDF class
class PDF(fpdf.FPDF):
    def __init__(self, user, customer, invoice):
        super().__init__()
        self.invoice = invoice
        self.customer = customer
        self.user = user
        self.add_font("Arial", style="", fname="./public/fonts/arial-unicode-ms.ttf", uni=True)
        self.add_font("Arial", style="B", fname="./public/fonts/arial-unicode-ms-bold.ttf", uni=True)

    def header(self):
        # Issuer data in header (top-right corner)
        self.set_font("Arial", style="B", size=8)
        self.set_xy(120, 10)  # Position in the top-right corner
        self.cell(0, 5, "Podatki o izdajatelju:", 0, 1, "R")
        self.set_font("Arial", size=9)
        self.cell(0, 5, f"{self.user.get('name')}", 0, 1, "R")
        self.cell(0, 5, f"{self.user.get('address')}", 0, 1, "R")
        self.cell(0, 5, f"Davčna številka: {self.user.get('tax_number')}", 0, 1, "R")
        self.cell(0, 5, f"Matična številka: {self.user.get('registration_number')}", 0, 1, "R")
        self.cell(0, 5, f"T: {self.user.get('phone')}", 0, 1, "R")
        if self.user.get("tax_payer"):
            self.cell(0, 5, "Davčni zavezanec: DA", 0, 1, "R")
        self.ln(2)
        self.set_font("Arial", style="B", size=10)
        self.cell(0, 5, f"Obvezno plačilo na račun odprt pri {self.user.get('bank')}", 0, 1, "R")
        self.cell(0, 5, f"IBAN: {self.user.get('iban')}", 0, 1, "R")
        self.ln(2)

        self.set_xy(120, 70)  # Position in the top-right corner
        # Invoice number and issue date (below issuer data)
        self.set_font("Arial", style="B", size=10)
        self.cell(0, 5, f"RAČUN št.: {self.invoice.get('invoice_number')}", 0, 1, "R")
        self.set_font("Arial", size=9)
        self.cell(0, 5, f"Datum izdaje: {datetime.datetime.now().strftime('%d.%m.%Y')}", 0, 1, "R")
        self.ln(2)

        # Service dates (below invoice info)
        self.cell(0, 5, f"Datum opravljene storitve: {self.invoice.get('issue_date', 'Ni določeno')}", 0, 1, "R")
        self.cell(0, 5, f"Datum zapadlosti računa: {self.invoice.get('due_date', 'Ni določeno')}", 0, 1, "R")
        self.ln(5)



def generate_invoice(user, customer, invoice, services):
    # Create the PDF instance
    pdf = PDF(user=user, customer=customer, invoice=invoice)
    pdf.add_font("Arial", style="", fname="arial-unicode-ms.ttf", uni=True)
    pdf.add_font("Arial", style="B", fname="arial-unicode-ms-bold.ttf", uni=True)
    pdf.alias_nb_pages()
    pdf.add_page()

    # Set a smaller font and tighter line spacing
    font_size = 9
    pdf.set_font("Arial", size=font_size)
    line_height = 5

    # Receiver Data (Top-Left Corner)
    pdf.set_xy(10, 60)
    pdf.set_font("Arial", style="B", size=8)
    pdf.cell(0, line_height, "Podatki o kupcu:", 0, 1)
    pdf.set_font("Arial", size=font_size, style="B")
    pdf.cell(0, line_height, f"{customer['name']}", 0, 1)
    pdf.set_font("Arial", size=font_size)
    pdf.cell(0, line_height, f"{customer['address']}", 0, 1)
    pdf.set_xy(10, 90)
    pdf.cell(0, line_height, f"Davčna številka SI: {customer['tax_number']}", 0, 1)

    # Service Details
    pdf.set_font("Arial", style="B", size=font_size)
    pdf.set_font("Arial", size=font_size)
    pdf.set_xy(10, 110)

    # Table headers
    pdf.cell(50, line_height, "Naziv storitve", border=0)  # Left-aligned
    pdf.cell(15, line_height, "Količina", border=0, align="R")  # Right-aligned
    pdf.cell(15, line_height, "Enota", border=0, align="R")  # Right-aligned
    pdf.cell(20, line_height, "Cena (€)", border=0, align="R")  # Right-aligned
    pdf.cell(15, line_height, "Rab. %", border=0, align="R")  # Right-aligned
    pdf.cell(25, line_height, "Davčna osnova", border=0, align="R")  # Right-aligned
    pdf.cell(15, line_height, "DDV %", border=0, align="R")  # Right-aligned
    pdf.set_x(175)  # Set x position close to the right margin
    pdf.cell(25, line_height, "Skupaj (€)", border=0, align="R")  # Right-aligned
    pdf.ln(line_height)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())

    # Table rows
    sum = 0
    sum_with_tax = 0
    for service in services:
        quantity = 1
        price_sum = quantity * service["price"]
        rabat = service.get("rabat", 0)  # Default Rabat % is 0 if not provided
        tax_base = price_sum * (1 - rabat / 100)
        tax_rate = 22  # Fixed DDV rate
        tax = tax_base * (tax_rate / 100)

        service_total = tax_base + tax

        sum += tax_base
        sum_with_tax += tax_base + tax

        # Populate table rows
        pdf.cell(50, line_height, service["name"], border=0)  # Left-aligned
        pdf.cell(15, line_height, f"{quantity}", border=0, align="R")  # Right-aligned
        pdf.cell(15, line_height, "kos", border=0, align="R")  # Right-aligned, always "kos"
        pdf.cell(20, line_height, f"{service['price']:.2f}", border=0, align="R")  # Right-aligned
        pdf.cell(15, line_height, f"{rabat:.2f}", border=0, align="R")  # Right-aligned
        pdf.cell(25, line_height, f"{tax_base:.2f}", border=0, align="R")  # Right-aligned
        pdf.cell(15, line_height, f"{tax_rate}", border=0, align="R")  # Right-aligned

        # Skupaj (€): Manually align to the right edge
        pdf.set_x(175)  # Set x position close to the right margin
        pdf.cell(25, line_height, f"{service_total:.2f}", border=0, align="R")  # Right-aligned
        pdf.ln(line_height)



    # Tax Calculation
    tax_price = sum * 0.22
    sum_with_tax = sum + tax_price
    pdf.ln(line_height * 2)
    pdf.cell(0, line_height, f"Skupaj brez DDV: {sum:.2f} €", 0, 1, "R")
    pdf.cell(0, line_height, f"DDV (22%): {tax_price:.2f} €", 0, 1, "R")
    pdf.ln(line_height) 
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(0, line_height, f"Skupaj z DDV za plačilo: {sum_with_tax:.2f} €", 0, 1, "R")

    pdf.ln(line_height * 2)

    # Tax Recapitulation
    pdf.set_font("Arial", style="B", size=font_size)
    pdf.cell(0, line_height, "Rekapitulacija DDV:", 0, 1, "R")
    pdf.set_font("Arial", size=font_size)
    pdf.cell(0, line_height, f"{'DDV osnova':<18}{'DDV%':<10}{'Znesek DDV':<15}{'Skupaj':<0}", 0, 1, "R")
    pdf.cell(0, line_height, f"{sum:<20.2f}{22:<20}{tax:<10.2f}{sum_with_tax:<0.2f}", 0, 1, "R")
    pdf.ln(line_height * 2)

    # Signature
    pdf.set_y(250)  # Set x position close to the right margin
    pdf.cell(0, line_height, "Poslujemo brez žiga", 0, 1, "R")
    pdf.cell(0, line_height, "Franc Potočnik (Podpis)", 0, 1, "R")

    return pdf




if __name__ == "__main__":
    # if len(sys.argv) != 6:
    #     print("Usage: python script.py <user_data> <customer_data> <invoice_data> <services>")
    #     sys.exit(1)

    user = eval(sys.argv[1])
    customer = eval(sys.argv[2])
    invoice = eval(sys.argv[3])
    services = eval(sys.argv[4])


    pdf = generate_invoice(user, customer, invoice, services)
    pdf_path = f"./invoices/Invoice_{invoice['invoice_number']}.pdf"
    pdf.output(pdf_path)
    
    print(pdf_path)
