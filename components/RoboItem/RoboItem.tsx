import {
  Button,
  Text,
  Image,
  Card,
  Box,
  Group,
  Badge,
  Popover,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const RoboItem = ({ id }: { id: number }) => {
  const { data, isLoading } = useQuery(["item", id], () =>
    client.post(`/Item/getItem`, { id })
  );
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
        <Popover width={"100%"} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button fullWidth variant="outline">
              Solicitar prestamo
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Group position="apart" mt="md" mb="xs">
              <Button fullWidth variant="gradient">
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
