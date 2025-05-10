package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDate;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_restaurant() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Request").click();

        page.getByText("Create RecommendationRequest").click();
        assertThat(page.getByText("Create New RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("aryan@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("blah@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("INeed a recommendation for a job");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill(LocalDate.parse("2022-01-03").toString());
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill(LocalDate.parse("2022-01-10").toString());
        page.getByTestId("RecommendationRequestForm-done").check();
        
        page.getByTestId("RecommendationRequestForm-submit").click();

        // assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        //         .hasText("aryan@ucsb.edu");

        // page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        // assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
        // page.getByTestId("RecommendationRequestForm-description").fill("THE BEST");
        // page.getByTestId("RecommendationRequestForm-submit").click();

        // assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-description")).hasText("THE BEST");

        // page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        // assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    // @Test
    // public void regular_user_cannot_create_restaurant() throws Exception {
    //     setupUser(false);

    //     page.getByText("RecommendationRequest").click();

    //     assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
    //     assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    // }
}