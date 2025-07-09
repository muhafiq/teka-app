export default async function DetailEvent({ params }) {
  const { id } = await params;

  return <div>{id}</div>;
}
