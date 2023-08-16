import pandas as pd
import pdf417gen
from PIL import Image
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage

# Your Gmail credentials
email_user = 'newsongmoffer@gmail.com'
email_password = 'nwytlqdnzrlsitky'

# Gmail SMTP server details
smtp_server = 'smtp.gmail.com'
smtp_port = 587  # or 465 for SSL

# Create a subfolder if it doesn't exist
subfolder = 'moffer_email'
if not os.path.exists(subfolder):
    os.makedirs(subfolder)

# Read CSV file
data = pd.read_csv('moffer.csv', encoding='latin1')  # Adjust the encoding if necessary

width = 400
height = width // 4

# Iterate through CSV rows
for index, row in data.iterrows():
    barcode_value = row['Barcode']
    barcode_pdf417 = pdf417gen.encode(barcode_value)
    barcode_image = pdf417gen.render_image(barcode_pdf417)
    barcode_image_resized = barcode_image.resize((width, height), Image.ANTIALIAS)

    file_name = f'{subfolder}/{barcode_value}.png'
    barcode_image_resized.save(file_name)

    # Create email message
    msg = MIMEMultipart()
    msg['Subject'] = 'Your Barcode for New Song Moffer'
    msg['From'] = email_user
    msg['To'] = row['Email']
    
    # Attach text content
    text = 'Here is your barcode for New Song Moffer. If you have any issues, simply reply back to this email. Thank you.'
    msg.attach(MIMEText(text, 'plain'))

    # Attach barcode image
    with open(file_name, 'rb') as f:
        img_data = f.read()
        image = MIMEImage(img_data, name=os.path.basename(file_name))
        msg.attach(image)

    # Send email using Gmail
    with smtplib.SMTP(smtp_server, smtp_port) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(email_user, email_password)
        smtp.send_message(msg)

    print(f"Email sent to {row['Email']} with barcode {barcode_value}")
