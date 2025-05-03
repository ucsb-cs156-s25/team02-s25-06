package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationsWebIT extends WebTestCase {
    
    @Autowired
        UCSBOrganizationsRepository ucsbOrganizationsRepository;

    @Test
    public void admin_user_can_create_edit_delete_ucsborganization() throws Exception {

        page.getByText("UCSBOrganizations").click();

        // page.getByText("Create Organization").click();
        // assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        // page.getByLabel("Org Code").fill("CC");
        // page.getByLabel("Org Translation Short").fill("Cool C");
        // page.getByLabel("Org Translation").fill("Cool Club");
        // page.getByLabel("Inactive").check();
        // page.getByLabel("Create").click();
        UCSBOrganizations organization1 = UCSBOrganizations.builder()
                .orgCode("cc")
                .orgTranslationShort("cool club")
                .orgTranslation("cool club1")
                .inactive(true)
                .build();
        ucsbOrganizationsRepository.save(organization1);
        
        setupUser(true);

        page.getByText("UCSBOrganizations").click();

        assertThat(page.getByTestId("UCSBOrganizationsTable-cell-row-0-col-orgCode")).hasText("cc");

        page.getByTestId("UCSBOrganizations-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizations-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganizations() throws Exception {
        setupUser(false);

        page.getByText("UCSBOrganizations").click();

        assertThat(page.getByText("Create Organization")).not().isVisible();
    }
    @Test
    public void admin_can_create_ucsborganizations() throws Exception {
        setupUser(true);

        page.getByText("UCSBOrganizations").click();

        assertThat(page.getByText("Create Organization")).isVisible();
    }
}