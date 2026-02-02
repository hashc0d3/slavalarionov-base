'use client'

import { useAuth } from '@/shared/context/auth.context'
import { isAdminUser } from '@/shared/lib/auth'
import { AdminPanelMantine } from '@/widgets/admin/ui/AdminPanelMantine'
import { GoogleLogin } from '@react-oauth/google'
import Link from 'next/link'
import {
  Container,
  Center,
  Title,
  Text,
  Anchor,
  Loader,
  Stack,
  Button,
  Group,
} from '@mantine/core'

export default function AdminPage() {
  const { user, isChecked, isLoading, loginWithGoogle, logout } = useAuth()

  if (!isChecked || isLoading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Container>
    )
  }

  // Не авторизован — показываем вход через Google
  if (!user) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Title order={1}>Вход в админ-панель</Title>
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (credential) loginWithGoogle(credential)
              }}
              onError={() => {}}
              useOneTap={false}
              theme="filled"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
            <Anchor href="/" size="sm">
              Вернуться на главную
            </Anchor>
          </Stack>
        </Center>
      </Container>
    )
  }

  // Авторизован, но не администратор
  if (!isAdminUser(user)) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Title order={1}>Доступ запрещен</Title>
            <Text c="dimmed">
              У вас нет прав для просмотра этой страницы. Роль: {user.role}.
            </Text>
            <Group>
              <Button variant="light" onClick={() => logout()}>
                Выйти
              </Button>
              <Anchor href="/" size="sm">
                На главную
              </Anchor>
            </Group>
          </Stack>
        </Center>
      </Container>
    )
  }

  // Администратор — шапка с теми же отступами, что и панель ниже + кнопка «Перейти на сайт»
  return (
    <Container size="xl" py="xl">
      <Stack gap="md" w="100%">
        <Container size="xl" py={0}>
          <Group justify="space-between" w="100%" wrap="nowrap" gap="md">
            <Text size="sm" c="dimmed" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </Text>
            <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
              <Button variant="light" size="xs" component={Link} href="/">
                Перейти на сайт
              </Button>
              <Button variant="subtle" size="xs" onClick={() => logout()}>
                Выйти
              </Button>
            </Group>
          </Group>
        </Container>
        <AdminPanelMantine />
      </Stack>
    </Container>
  )
}
