package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = HelpRequestsController.class)
@Import(TestConfig.class)

public class HelpRequestControllerTests extends ControllerTestCase {

        @MockBean
        HelpRequestRepository helpRequestRepository;

        @MockBean
        UserRepository userRepository;

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequests/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequests/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_help_requests() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2025-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt1)
                                .explanation("testing")
                                .solved(true)
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

                HelpRequest helpRequest2 = HelpRequest.builder()
                                .requesterEmail("yarwinliu@ucsb.edu")
                                .teamId("s25-6pm-4")
                                .tableOrBreakoutRoom("4")
                                .requestTime(ldt2)
                                .explanation("testing2")
                                .solved(false)
                                .build();

                ArrayList<HelpRequest> expectedHelpRequests = new ArrayList<>();
                expectedHelpRequests.addAll(Arrays.asList(helpRequest1, helpRequest2));

                when(helpRequestRepository.findAll()).thenReturn(expectedHelpRequests);

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedHelpRequests);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_help_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt1)
                                .explanation("testing")
                                .solved(true)
                                .build();

                when(helpRequestRepository.save(eq(helpRequest1))).thenReturn(helpRequest1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/helprequests/post?requesterEmail=riyagupta@ucsb.edu&teamId=s25-6pm-6&tableOrBreakoutRoom=6&requestTime=2022-01-03T00:00:00&explanation=testing&solved=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).save(eq(helpRequest1));
                String expectedJson = mapper.writeValueAsString(helpRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt)
                                .explanation("testing")
                                .solved(true)
                                .build();

                when(helpRequestRepository.findById(eq(7L))).thenReturn(Optional.of(helpRequest1));

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(helpRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(helpRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequests?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(helpRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("HelpRequest with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_help_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-04T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt1)
                                .explanation("testing")
                                .solved(true)
                                .build();

                HelpRequest helpRequest2 = HelpRequest.builder()
                                .requesterEmail("rgupta@ucsb.edu")
                                .teamId("s25-6pm-4")
                                .tableOrBreakoutRoom("4")
                                .requestTime(ldt2)
                                .explanation("testing2")
                                .solved(false)
                                .build();

                String requestBody = mapper.writeValueAsString(helpRequest2);

                when(helpRequestRepository.findById(eq(67L))).thenReturn(Optional.of(helpRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(67L);
                verify(helpRequestRepository, times(1)).save(helpRequest2);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_help_request_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt1)
                                .explanation("testing")
                                .solved(true)
                                .build();

                String requestBody = mapper.writeValueAsString(helpRequest1);

                when(helpRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 67 not found", json.get("message"));

        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_help_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest helpRequest1 = HelpRequest.builder()
                                .requesterEmail("riyagupta@ucsb.edu")
                                .teamId("s25-6pm-6")
                                .tableOrBreakoutRoom("6")
                                .requestTime(ldt1)
                                .explanation("testing")
                                .solved(true)
                                .build();

                when(helpRequestRepository.findById(eq(15L))).thenReturn(Optional.of(helpRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(15L);
                verify(helpRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_helprequest_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(helpRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(helpRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 not found", json.get("message"));
        }

}
