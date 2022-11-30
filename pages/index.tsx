import Layout from "../components/layout/Layout";
import RoboItem from "../components/RoboItem/RoboItem";
import client from "../client";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@mantine/core";

const Home = () => {
  const { data, isLoading } = useQuery(["items"], () =>
    client.get("/Item/getItems")
  );

  return (
    <Layout>
      <h1>Inventario</h1>
      {isLoading ? (
        <></>
      ) : (
        <Group position="center" mt="md" mb="xs">
          {data?.data?.map((item: any) => (
            <RoboItem id={item.id} key={item.id} />
          ))}
        </Group>
      )}
    </Layout>
  );
};

export default Home;
