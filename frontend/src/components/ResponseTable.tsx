import { Paper, Title, Table, Badge, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

interface Response {
  id: string;
  user_name: string;
  is_available: boolean;
  message?: string;
}

interface ResponseTableProps {
  responses: Response[];
}

export default function ResponseTable({ responses }: ResponseTableProps) {
  if (responses.length === 0) {
    return (
      <Paper shadow="md" p="xl">
        <Text ta="center" c="dimmed">
          No responses yet. Be the first to respond!
        </Text>
      </Paper>
    );
  }

  const rows = responses.map((response) => (
    <Table.Tr key={response.id}>
      <Table.Td>{response.user_name}</Table.Td>
      <Table.Td>
        <Badge
          color={response.is_available ? 'green' : 'red'}
          variant="light"
          leftSection={response.is_available ? <IconCheck size="0.8rem" /> : <IconX size="0.8rem" />}
        >
          {response.is_available ? 'Available' : 'Not Available'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c={response.message ? undefined : 'dimmed'}>
          {response.message || 'No message'}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="md" p={{ base: "md", sm: "xl" }}>
      <Title order={2} mb="md">Responses</Title>
      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Available</Table.Th>
              <Table.Th>Message</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}