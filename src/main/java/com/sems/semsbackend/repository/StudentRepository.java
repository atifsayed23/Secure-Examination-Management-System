package com.sems.semsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sems.semsbackend.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

}