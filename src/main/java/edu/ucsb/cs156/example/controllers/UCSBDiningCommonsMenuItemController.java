package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



/**
 * This is a REST controller for UCSBDiningCommonsMenuItem
 */

@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    /**
     * List all UCSB Dining Commons Menu Items
     */
    @Operation(summary = "List all UCSB Dining Commons Menu Items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allMenuItems() {
        Iterable<UCSBDiningCommonsMenuItem> items = ucsbDiningCommonsMenuItemRepository.findAll();
        return items;
    }

    /**
     * Get a single UCSB Dining Commons Menu Item by id
     * 
     * @param id the id of the menu item
     * @return a UCSBDiningCommonsMenuItem
     */
    @Operation(summary = "Get a single UCSB Dining Commons Menu Item by id")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getById(
            @Parameter(name = "id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem item = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));
        return item;
    }

    /**
     * Create a new UCSB Dining Commons Menu Item
     * 
     * @param diningcommonscode dining commons code
     * @param name               name of the menu item
     * @param station            station where the item is located
     * @return the saved menu item
     */
    @Operation(summary = "Create a new UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postUCSBDiningCommonsMenuItem(
            @Parameter(name = "diningcommonscode") @RequestParam String diningcommonscode,
            @Parameter(name = "name") @RequestParam String name,
            @Parameter(name = "station") @RequestParam String station
    ) throws JsonProcessingException {

        UCSBDiningCommonsMenuItem item = new UCSBDiningCommonsMenuItem();
        item.setDiningCommonsCode(diningcommonscode);
        item.setName(name);
        item.setStation(station);

        UCSBDiningCommonsMenuItem savedItem = ucsbDiningCommonsMenuItemRepository.save(item);
        return savedItem;
    }

    /**
     * Delete a UCSB Dining Commons Menu Item
     * 
     * @param id the id of the menu item to delete
     * @return a message indicating the menu item was deleted
     */
    @Operation(summary = "Delete a UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonsMenuItem(
            @Parameter(name = "id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem item = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(item);
        return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
    }

    @Operation(summary = "Update a UCSB Dining Commons Menu Item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItem updateUCSBDiningCommonsMenuItem(
        @Parameter(name = "id") @RequestParam Long id,
        @RequestBody UCSBDiningCommonsMenuItem newItem) {

    UCSBDiningCommonsMenuItem item = ucsbDiningCommonsMenuItemRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

   item.setDiningCommonsCode(newItem.getDiningCommonsCode());
   item.setName(newItem.getName());
   item.setStation(newItem.getStation());

    ucsbDiningCommonsMenuItemRepository.save(item);

    return item;
}


}