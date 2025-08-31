import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, Button, Group, Loader, Center, Alert } from '@mantine/core';
import { IconShare, IconRefresh, IconPlus, IconAlertCircle, IconCalendarPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import ResponseTable from '../components/ResponseTable';
import AddResponseModal from '../components/AddResponseModal';
import ShareModal from '../components/ShareModal';
import { GroupPageSkeleton } from '../components/LoadingSkeleton';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { apiUrl } from '../config/api';

interface GroupData {
  id: string;
  name: string;
  description?: string;
  date: string;
}

interface Response {
  id: string;
  user_name: string;
  is_available: boolean;
  message?: string;
}

interface GroupViewPageProps {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

export default function GroupViewPage({ colorScheme, toggleColorScheme }: GroupViewPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchGroupData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl(`api/groups/${id}`));
      if (response.ok) {
        const data = await response.json();
        setGroup(data.group);
        setResponses(data.responses || []);
        setError(null);
      } else if (response.status === 404) {
        setError('Group not found');
      } else {
        throw new Error('Failed to fetch group data');
      }
    } catch (err) {
      console.error('Error fetching group:', err);
      setError('Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const handleResponseAdded = () => {
    setShowAddResponse(false);
    fetchGroupData();
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (isLoading) {
    return <GroupPageSkeleton />;
  }

  if (error || !group) {
    return (
      <Container size="xs" mt="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
        >
          {error || 'Group not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="md">
      <Group justify="space-between" mb="md" wrap="wrap">
        <Title order={3}>Who's Free?</Title>
        <Group gap="sm">
          <ColorSchemeToggle colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
          <Button
            variant="light"
            leftSection={<IconCalendarPlus size="1rem" />}
            onClick={() => navigate('/')}
            size="sm"
          >
            Create New Event
          </Button>
        </Group>
      </Group>
      
      <Paper shadow="md" p={{ base: "md", sm: "xl" }} mb="md">
        <Group justify="space-between" align="flex-start" mb="md" wrap="wrap">
          <div style={{ minWidth: 0, flex: 1 }}>
            <Title order={1} mb="sm" size={{ base: "h2", sm: "h1" }}>{group.name}</Title>
            {group.description && (
              <Text c="dimmed" mb="xs" size={{ base: "sm", sm: "md" }}>{group.description}</Text>
            )}
            <Text size="sm" c="dimmed">
              Date: {new Date(group.date + 'T00:00:00').toLocaleDateString()}
            </Text>
          </div>
          <Button
            variant="light"
            leftSection={<IconShare size="1rem" />}
            onClick={handleShare}
            size="sm"
            mt={{ base: "sm", sm: 0 }}
          >
            Share Link
          </Button>
        </Group>

        <Group wrap="wrap" gap="sm">
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => setShowAddResponse(true)}
            size="sm"
          >
            Add Your Response
          </Button>
          <Button
            variant="light"
            leftSection={<IconRefresh size="1rem" />}
            onClick={fetchGroupData}
            size="sm"
          >
            Refresh
          </Button>
        </Group>
      </Paper>

      <ResponseTable responses={responses} />

      {showAddResponse && (
        <AddResponseModal
          groupId={id!}
          onClose={() => setShowAddResponse(false)}
          onSuccess={handleResponseAdded}
        />
      )}

      {showShareModal && (
        <ShareModal
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </Container>
  );
}