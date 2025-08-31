import { Container, Paper, Skeleton, Stack, Group } from '@mantine/core';

export function GroupPageSkeleton() {
  return (
    <Container size="lg" mt="md">
      <Group justify="space-between" mb="md">
        <Skeleton height={32} width={150} />
        <Skeleton height={32} width={140} />
      </Group>
      
      <Paper shadow="md" p={{ base: "md", sm: "xl" }} mb="md">
        <Group justify="space-between" align="flex-start" mb="md">
          <div style={{ flex: 1 }}>
            <Skeleton height={36} width="60%" mb="sm" />
            <Skeleton height={20} width="80%" mb="xs" />
            <Skeleton height={16} width="40%" />
          </div>
          <Skeleton height={32} width={120} />
        </Group>

        <Group>
          <Skeleton height={32} width={140} />
          <Skeleton height={32} width={100} />
        </Group>
      </Paper>

      <Paper shadow="md" p={{ base: "md", sm: "xl" }}>
        <Skeleton height={28} width={120} mb="md" />
        <Stack gap="xs">
          {[1, 2, 3].map((i) => (
            <Group key={i} justify="space-between">
              <Skeleton height={20} width="30%" />
              <Skeleton height={20} width="25%" />
              <Skeleton height={20} width="35%" />
            </Group>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}