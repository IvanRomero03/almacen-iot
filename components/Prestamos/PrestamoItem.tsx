import { Group, Badge, Text, Card, Avatar, Header } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const PrestamoItem = ({ id }: { id: number }) => {
  const { data, isLoading } = useQuery(["prestamo", id], () =>
    client.post(`/Prestamo/getPrestamo`, { id })
  );

  console.log(data?.data);

  return (
    <>
      <Card shadow="sm" p="lg" radius="md" m="md" withBorder w="95%">
        <Group position="apart" mt="md" mb="xs">
          <Avatar
            src={
              "https://bfmvwivyerrefrhrlmxx.supabase.co/storage/v1/object/public/imagenes/Almacen/" +
              id +
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
        </Group>
      </Card>
    </>
  );
};

export default PrestamoItem;
