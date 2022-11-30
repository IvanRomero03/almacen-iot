import {
  Button,
  Text,
  Image,
  Card,
  Box,
  Group,
  Badge,
  Popover,
  ActionIcon,
  NumberInputHandlers,
  NumberInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { useState, useRef } from "react";
import { showNotification } from "@mantine/notifications";

const RoboItem = ({ id }: { id: number }) => {
  const [opened, setOpened] = useState(false);
  const { data, isLoading } = useQuery(["item", id], () =>
    client.post(`/Item/getItem`, { id })
  );

  const [value, setValue] = useState(0);
  const handlers = useRef<NumberInputHandlers>();

  const sumbitPeticion = async () => {
    setOpened(false);
    await client.post("External/createPetition", {
      userId: 1,
      itemId: id,
      quantity: value,
    });
    showNotification({
      title: "Petición creada",
      message: "Tiene 30 segundos para autorizar la petición en el módulo RFID",
    });
  };

  return (
    <>
      <Card
        shadow="md"
        p="lg"
        radius="md"
        withBorder
        style={{
          width: "25%",
        }}
      >
        <Card.Section>
          <Group position="center">
            <Image
              src={
                "https://bfmvwivyerrefrhrlmxx.supabase.co/storage/v1/object/public/imagenes/Almacen/" +
                id +
                ".jpg"
              }
              alt="NodeMCU"
              height={200}
              width={200}
            />
          </Group>
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text size="xl" weight={500}>
            {data?.data?.name}
          </Text>
          <Badge color="blue" variant="light">
            {data?.data?.existencia} en existencia
          </Badge>
        </Group>
        <Popover
          width={"100%"}
          position="bottom"
          withArrow
          shadow="md"
          opened={opened}
          onChange={setOpened}
        >
          <Popover.Target>
            <Button fullWidth variant="outline" onClick={() => setOpened(true)}>
              Solicitar prestamo
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Group position="center" mt="md" mb="xs">
              <Text size="lg" weight={500}>
                Cantidad
              </Text>
              <Group spacing={5}>
                <ActionIcon
                  size={36}
                  variant="default"
                  onClick={() => handlers?.current?.decrement()}
                >
                  –
                </ActionIcon>

                <NumberInput
                  hideControls
                  value={value}
                  onChange={(val: number) => setValue(val)}
                  handlersRef={handlers}
                  max={data?.data?.existencia}
                  min={0}
                  step={1}
                  styles={{ input: { width: 54, textAlign: "center" } }}
                />

                <ActionIcon
                  size={36}
                  variant="default"
                  onClick={() => handlers?.current?.increment()}
                >
                  +
                </ActionIcon>
              </Group>
              <Button fullWidth variant="gradient" onClick={sumbitPeticion}>
                Confirmar
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Card>
    </>
  );
};

export default RoboItem;
