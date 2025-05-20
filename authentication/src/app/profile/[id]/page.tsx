export default async function userProfile({ params }: any) {
  const id = await params.id;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <h2>Welcome to Profile Page</h2>
      <p className="text-2xl font-bold">The input param is : {id}</p>
    </div>
  );
}
