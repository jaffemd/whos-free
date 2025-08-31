import { useState } from 'react';
import { Modal, TextInput, Radio, Textarea, Button, Group, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface AddResponseModalProps {
  groupId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddResponseModal({ groupId, onClose, onSuccess }: AddResponseModalProps) {
  const [userName, setUserName] = useState('');
  const [isAvailable, setIsAvailable] = useState('true');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!userName.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Name is required.',
        color: 'red',
      });
      return;
    }
    
    if (userName.trim().length > 255) {
      notifications.show({
        title: 'Validation Error',
        message: 'Name must be 255 characters or less.',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName.trim(),
          isAvailable: isAvailable === 'true',
          message: message.trim() || undefined,
        }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Your response has been added!',
          color: 'green',
        });
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add response');
      }
    } catch (error) {
      console.error('Error adding response:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add response. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Add Your Response"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.currentTarget.value)}
            required
            withAsterisk
          />

          <Radio.Group
            label="Are you available?"
            value={isAvailable}
            onChange={setIsAvailable}
            required
            withAsterisk
          >
            <Stack mt="xs">
              <Radio value="true" label="Yes, I'm available" color="green" />
              <Radio value="false" label="No, I can't make it" color="red" />
            </Stack>
          </Radio.Group>

          <Textarea
            label="Message (optional)"
            placeholder="Any additional comments..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            rows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!userName.trim()}
            >
              Add Response
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}