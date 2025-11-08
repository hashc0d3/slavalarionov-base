'use client'

import { useEffect, useState } from 'react'
import { AdminPanelMantine } from '@/widgets/admin/ui/AdminPanelMantine'
import { isAdmin } from '@/shared/lib/auth'
import { Container, Center, Title, Text, Anchor, Loader, Stack, Code } from '@mantine/core'

export default function AdminPage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAccess = () => {
      const access = isAdmin()
      setHasAccess(access)
      setIsLoading(false)
    }
    
    checkAccess()
  }, [])

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Container>
    )
  }

  if (!hasAccess) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Title order={1}>Доступ запрещен</Title>
            <Text c="dimmed">У вас нет прав для просмотра этой страницы.</Text>
            <Stack gap="xs">
              <Text size="sm">Для доступа в консоли браузера выполните:</Text>
              <Code block>localStorage.setItem('ROLE', 'ADMIN')</Code>
            </Stack>
            <Anchor href="/" size="sm">
              Вернуться на главную
            </Anchor>
          </Stack>
        </Center>
      </Container>
    )
  }

  return <AdminPanelMantine />
}

