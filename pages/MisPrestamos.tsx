import Layout from "../components/layout/Layout";
import RoboItem from "../components/RoboItem/RoboItem";
import PrestamoItem from "../components/Prestamos/PrestamoItem";
import { useQuery } from "@tanstack/react-query";
import client from "../client";
import { Badge, Group, Text } from "@mantine/core";

const Home = () => {
  const { data, isLoading } = useQuery(["prestamosUser"], () =>
    client.post("/Prestamo/getUserPrestamos", { id: 1 })
  );

  const inactivePrestamos = useQuery(["prestamosUserIn"], () =>
    client.post("/Prestamo/getUserInactives", { id: 1 })
  );

  return (
    <Layout>
      <h1>Mis Prestamos</h1>
      <Group position="left" mt="md" mb="xs">
        <Text>Prestamos activos: </Text>
        <Badge color="red" variant="light">
          {data?.data?.length}
        </Badge>
      </Group>
      {isLoading ? (
        <></>
      ) : (
        data?.data?.map((item: any) => (
          <PrestamoItem id={item.id} key={item.id} />
        ))
      )}
      <Group position="left" mt="md" mb="xs">
        <Text>Prestamos inactivos: </Text>
        <Badge color="cyan" variant="light">
          {inactivePrestamos?.data?.data?.length}
        </Badge>
      </Group>
      {isLoading ? (
        <></>
      ) : (
        inactivePrestamos?.data?.data?.map((item: any) => (
          <PrestamoItem id={item.id} key={item.id} />
        ))
      )}
    </Layout>
  );
};

export default Home;
