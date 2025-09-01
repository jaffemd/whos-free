import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, Textarea, Button, Stack, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { apiUrl } from '../config/api';

interface HomePageProps {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

export default function HomePage({ colorScheme, toggleColorScheme }: HomePageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Group name is required.',
        color: 'red',
      });
      return;
    }
    
    if (name.trim().length > 255) {
      notifications.show({
        title: 'Validation Error',
        message: 'Group name must be 255 characters or less.',
        color: 'red',
      });
      return;
    }
    
    if (!date) {
      notifications.show({
        title: 'Validation Error',
        message: 'Date is required.',
        color: 'red',
      });
      return;
    }

    // Parse the date string (format: YYYY-MM-DD)
    const dateObj = new Date(date + 'T00:00:00.000'); // Add time to ensure local timezone

    // Validate the parsed date
    if (isNaN(dateObj.getTime())) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select a valid date.',
        color: 'red',
      });
      return;
    }

    // Create consistent date comparison using local timezone
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Convert the selected date to local timezone for comparison
    const selectedLocal = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    
    if (selectedLocal < todayLocal) {
      const todayString = today.getFullYear() + '-' + 
                         String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(today.getDate()).padStart(2, '0');
      const selectedString = dateObj.getFullYear() + '-' + 
                            String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(dateObj.getDate()).padStart(2, '0');
      
      notifications.show({
        title: 'Validation Error',
        message: `Date cannot be in the past. Selected: ${selectedString}, Today: ${todayString}`,
        color: 'red',
      });
      return;
    }
    
    // Format date for API (YYYY-MM-DD) - use the string directly since it's already in correct format
    const selectedString = date;

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl('api/groups'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          date: selectedString,
        }),
      });

      if (response.ok) {
        const group = await response.json();
        notifications.show({
          title: 'Success',
          message: 'Group created successfully!',
          color: 'green',
        });
        navigate(`/group/${group.id}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create group. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt={{ base: "md", sm: "xl" }} px="md">
      <Group justify="flex-end" mb="md">
        <ColorSchemeToggle colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
      </Group>
      <Paper shadow="md" p={{ base: "md", sm: "xl" }}>
        <Title order={1} ta="center" mb="xl">
          Who's Free?
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Group Name"
              placeholder="e.g., Weekend Hiking Trip"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
              withAsterisk
            />

            <Textarea
              label="Description"
              placeholder="Optional details about the event"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              rows={3}
            />

            <DateInput
              label="Date"
              placeholder="Select date"
              value={date}
              onChange={setDate}
              required
              withAsterisk
              minDate={new Date()}
              weekendDays={[]}
            />

            <Button
              type="submit"
              loading={isLoading}
              disabled={!name || !date}
              size="md"
            >
              Create Group
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}