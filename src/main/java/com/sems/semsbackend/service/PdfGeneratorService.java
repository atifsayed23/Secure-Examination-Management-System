package com.sems.semsbackend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.sems.semsbackend.dto.HallTicketDTO;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

@Service
public class PdfGeneratorService {

    private final HallTicketService hallTicketService;

    public PdfGeneratorService(HallTicketService hallTicketService) {
        this.hallTicketService = hallTicketService;
    }

    public byte[] generateHallTicketPdf(Long studentId, Long examId) {
        HallTicketDTO hallTicket = hallTicketService.generateHallTicket(studentId, examId);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("EXAMINATION HALL TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Student Details
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            
            document.add(new Paragraph("Student Details", boldFont));
            document.add(new Paragraph("Name: " + hallTicket.getStudentName(), normalFont));
            document.add(new Paragraph("Enrollment No: " + hallTicket.getEnrollmentNumber(), normalFont));
            document.add(new Paragraph("Semester/Dept: Sem " + hallTicket.getSemester() + " - " + hallTicket.getDepartment(), normalFont));
            document.add(Chunk.NEWLINE);

            // Exam Details
            document.add(new Paragraph("Exam Details", boldFont));
            document.add(new Paragraph("Exam Name: " + hallTicket.getExamName() + " (" + hallTicket.getExamCode() + ")", normalFont));
            document.add(new Paragraph("Date: " + hallTicket.getExamDate().toString(), normalFont));
            document.add(new Paragraph("Duration: " + hallTicket.getDurationMinutes() + " Minutes", normalFont));
            document.add(Chunk.NEWLINE);

            // Hall Details
            document.add(new Paragraph("Seating Details", boldFont));
            document.add(new Paragraph("Building: " + hallTicket.getBuilding() + " (Floor " + hallTicket.getFloor() + ")", normalFont));
            document.add(new Paragraph("Hall No: " + hallTicket.getHallNumber(), normalFont));
            document.add(new Paragraph("Seat No: " + hallTicket.getSeatNumber(), normalFont));
            document.add(Chunk.NEWLINE);

            // Instructions
            document.add(new Paragraph("Instructions", boldFont));
            com.lowagie.text.List list = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
            for (String instruction : hallTicket.getInstructions()) {
                list.add(new ListItem(instruction, normalFont));
            }
            document.add(list);
            document.add(Chunk.NEWLINE);

            // Generate QR Code
            String qrData = String.format("Enrollment:%s|ExamCode:%s|Seat:%s", 
                    hallTicket.getEnrollmentNumber(), hallTicket.getExamCode(), hallTicket.getSeatNumber());
            byte[] qrCodeImageBytes = generateQRCodeImage(qrData);

            if (qrCodeImageBytes != null) {
                Image img = Image.getInstance(qrCodeImageBytes);
                img.setAlignment(Element.ALIGN_CENTER);
                img.scaleAbsolute(150, 150);
                document.add(img);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private byte[] generateQRCodeImage(String barcodeText) {
        try {
            QRCodeWriter barcodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 200, 200);
            BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            System.err.println("Failed to generate QR code: " + e.getMessage());
            return null;
        }
    }
}
