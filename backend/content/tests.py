from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .services import generate_prompt
from .models import GeneratedContent

class ContentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", email="user1@example.com", password="Password123!")
        self.user2 = User.objects.create_user(username="user2", email="user2@example.com", password="Password123!")

        # Obtain token for user1
        res1 = self.client.post(reverse('login'), {"email": "user1@example.com", "password": "Password123!"}, format='json')
        self.user1_token = res1.data['data']['tokens']['access']

        # Obtain token for user2
        res2 = self.client.post(reverse('login'), {"email": "user2@example.com", "password": "Password123!"}, format='json')
        self.user2_token = res2.data['data']['tokens']['access']

        self.generate_url = reverse('content-generate')
        self.history_url = reverse('content-history')

    def test_prompt_builder_service(self):
        prompt = generate_prompt(
            topic="Artificial Intelligence",
            content_type="Blog",
            tone="Professional",
            additional_instruction="Explain in simple language"
        )
        expected_substring_1 = "Write a professional blog about Artificial Intelligence."
        expected_substring_2 = "Additional instruction:\nExplain in simple language"
        expected_substring_3 = "Return only the generated content."

        self.assertIn(expected_substring_1, prompt)
        self.assertIn(expected_substring_2, prompt)
        self.assertIn(expected_substring_3, prompt)

    def test_generate_content_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user1_token)
        payload = {
            "topic": "Artificial Intelligence",
            "content_type": "Blog",
            "tone": "Professional",
            "additional_instruction": "Explain in simple language"
        }
        response = self.client.post(self.generate_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['message'], "Content generated successfully.")
        self.assertIn('id', response.data['data'])
        self.assertIn('generated_text', response.data['data'])
        self.assertIn('created_at', response.data['data'])

        # Verify saved in DB
        self.assertEqual(GeneratedContent.objects.filter(user=self.user1).count(), 1)

    def test_content_history_ordering(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user1_token)
        payload1 = {"topic": "Topic 1", "content_type": "Blog", "tone": "Casual"}
        payload2 = {"topic": "Topic 2", "content_type": "Email", "tone": "Formal"}

        self.client.post(self.generate_url, payload1, format='json')
        self.client.post(self.generate_url, payload2, format='json')

        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 2)
        # Newest first check
        self.assertEqual(response.data['data'][0]['topic'], "Topic 2")
        self.assertEqual(response.data['data'][1]['topic'], "Topic 1")

    def test_content_detail_ownership_permission(self):
        # User 1 generates content
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user1_token)
        payload = {"topic": "Private Topic", "content_type": "Post", "tone": "Friendly"}
        gen_res = self.client.post(self.generate_url, payload, format='json')
        content_id = gen_res.data['data']['id']

        detail_url = reverse('content-detail', kwargs={'pk': content_id})

        # User 1 accesses item -> Success
        res_user1 = self.client.get(detail_url)
        self.assertEqual(res_user1.status_code, status.HTTP_200_OK)
        self.assertTrue(res_user1.data['success'])

        # User 2 attempts to access User 1's item -> Permission Denied (403)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user2_token)
        res_user2 = self.client.get(detail_url)
        self.assertEqual(res_user2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(res_user2.data['success'])

    def test_delete_content_item_ownership(self):
        # User 1 generates content
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user1_token)
        payload = {"topic": "To Delete Topic", "content_type": "Tweet", "tone": "Witty"}
        gen_res = self.client.post(self.generate_url, payload, format='json')
        content_id = gen_res.data['data']['id']

        detail_url = reverse('content-detail', kwargs={'pk': content_id})

        # User 2 attempts to delete User 1's item -> Permission Denied (403)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user2_token)
        del_user2 = self.client.delete(detail_url)
        self.assertEqual(del_user2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(GeneratedContent.objects.filter(id=content_id).exists())

        # User 1 deletes item -> Success
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user1_token)
        del_user1 = self.client.delete(detail_url)
        self.assertEqual(del_user1.status_code, status.HTTP_200_OK)
        self.assertFalse(GeneratedContent.objects.filter(id=content_id).exists())
