import Nav from "../components/home/nav/nav";
import Form from "../components/home/body/form";
import Footer from "../components/home/footer/footer";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Nav />
      <main className="w-full p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Form />
        </div>
      </main>
      <Footer />
    </div>
  );
}
