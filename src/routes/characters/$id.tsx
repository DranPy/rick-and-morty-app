import { createFileRoute } from "@tanstack/react-router";
import { getCharacter } from "rickmortyapi";

export const Route = createFileRoute("/characters/$id")({
  component: RouteComponent,
  loader: async ({ params }) => await getCharacter(Number(params.id)),
});

function RouteComponent() {
  const { data } = Route.useLoaderData();

  return (
    <div>
      <h1>Character Details</h1>
      {data ? (
        <div>
          <h2>{data.name}</h2>
          <img src={data.image} alt={data.name} />
          <p>Status: {data.status}</p>
          <p>Species: {data.species}</p>
          <p>Gender: {data.gender}</p>
          <p>Origin: {data.origin.name}</p>
          <p>Location: {data.location.name}</p>
          <p>Number of Episodes: {data.episode.length}</p>
          <p>Created: {new Date(data.created).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
