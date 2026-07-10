package com.sems.semsbackend.controller;

import com.sems.semsbackend.dto.HallTicketDTO;
import com.sems.semsbackend.service.HallTicketService;
import com.sems.semsbackend.service.PdfGeneratorService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hall-tickets")
public class HallTicketController {

    private final HallTicketService hallTicketService;
    private final PdfGeneratorService pdfGeneratorService;

    public HallTicketController(HallTicketService hallTicketService, PdfGeneratorService pdfGeneratorService) {
        this.hallTicketService = hallTicketService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @GetMapping("/student/{studentId}/exam/{examId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER', 'ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<HallTicketDTO> getHallTicket(@PathVariable Long studentId, @PathVariable Long examId) {
        HallTicketDTO hallTicket = hallTicketService.generateHallTicket(studentId, examId);
        return ResponseEntity.ok(hallTicket);
    }

    @GetMapping("/student/{studentId}/exam/{examId}/download")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_EXAM_CONTROLLER', 'EXAM_CONTROLLER', 'ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<byte[]> downloadHallTicket(@PathVariable Long studentId, @PathVariable Long examId) {
        byte[] pdfBytes = pdfGeneratorService.generateHallTicketPdf(studentId, examId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "hall_ticket.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
