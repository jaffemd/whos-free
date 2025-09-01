import { Modal, TextInput, Button, Group, Stack, Text } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export default function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      notifications.show({
        title: 'Success',
        message: 'Link copied to clipboard!',
        color: 'green',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy link. Please copy it manually.',
        color: 'red',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Who\'s Free - Group Availability',
          text: 'Check out this group availability survey',
          url: url,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Share This Group"
      centered
      size="sm"
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Share this link with others so they can add their availability:
        </Text>
        
        <TextInput
          value={url}
          readOnly
          onClick={(e) => e.currentTarget.select()}
        />

        <Group justify="center">
          <Button
            leftSection={copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
            onClick={handleCopy}
            variant={copied ? "light" : "filled"}
            color={copied ? "green" : "blue"}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          
          {'share' in navigator && (
            <Button
              variant="light"
              onClick={handleShare}
            >
              Share
            </Button>
          )}
        </Group>
        
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}