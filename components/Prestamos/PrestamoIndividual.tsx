import {
  Group,
  Badge,
  Text,
  Card,
  Avatar,
  Header,
  Button,
  Popover,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";

const PrestamoIndividual = ({ id }: { id: number }) => {
  const [opened, setOpened] = useState(false);
  const { data, isLoading } = useQuery(["prestamo", id], () =>
    client.post(`/Prestamo/getPrestamo`, { id })
  );

  const queryClient = useQueryClient();

  const handleDevolver = async () => {
    setOpened(false);
    await client.post("/External/devolverItem", {
      itemId: data?.data?.Item?.id,
      quantity: data?.data?.Cantidad,
      idPrestamo: id,
    });
    showNotification({
      title: "Devolver Item",
      message: "Favor de devolver el item al almacen en la celda abierta",
    });
    queryClient.invalidateQueries(["prestamo", id]);
    queryClient.invalidateQueries(["prestamosUser"]);
    queryClient.invalidateQueries(["prestamosUserIn"]);
    queryClient.invalidateQueries(["prestamos"]);
    queryClient.invalidateQueries(["prestamosIn"]);
  };

  console.log(data?.data);

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        position="left"
        withArrow
        shadow="md"
      >
        <Card shadow="sm" p="lg" radius="md" m="md" withBorder w="95%">
          <Group position="apart" mt="md" mb="xs">
            <Avatar
              src={
                "https://bfmvwivyerrefrhrlmxx.supabase.co/storage/v1/object/public/imagenes/Almacen/" +
                data?.data?.Item?.id +
                ".jpg"
              }
              alt={data?.data?.Item?.name}
              size="sm"
            />
            <Text size="xl" weight={500}>
              {data?.data?.Item?.name}
            </Text>
            <Text>{data?.data?.Item?.category}</Text>
            <Badge color="green" variant="light">
              {data?.data?.Item?.department}
            </Badge>
            <Badge color="indigo" variant="light">
              {data?.data?.Cantidad} en prestamo
            </Badge>
            <Text size="xl" weight={400}>
              {data?.data?.User?.name}
            </Text>
            <Avatar
              src={
                "https://bfmvwivyerrefrhrlmxx.supabase.co/storage/v1/object/public/imagenes/Almacen/Usuarios" +
                data?.data?.User?.id +
                ".jpg"
              }
              alt={data?.data?.User?.name}
              size="sm"
            />

            <Popover.Target>
              <Button
                color="green"
                variant="outline"
                onClick={() => setOpened(true)}
              >
                Devolver
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text>¿Estas seguro de devolver el item?</Text>
              <Button onClick={handleDevolver}>Devolver</Button>
            </Popover.Dropdown>
          </Group>
        </Card>
      </Popover>
    </>
  );
};

export default PrestamoIndividual;
