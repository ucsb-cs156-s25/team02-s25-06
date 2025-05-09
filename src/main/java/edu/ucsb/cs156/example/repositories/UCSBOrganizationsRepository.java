package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.UCSBOrganizations;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The UCSBOrganizationRepository is a repository for UCSBOrganization entities.
 */

@Repository
public interface UCSBOrganizationsRepository extends CrudRepository<UCSBOrganizations, Long> {

    
}