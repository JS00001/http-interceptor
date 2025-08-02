import useRouter from "@/store/router";
import Button from "@/components/ui/Button";

export default function Intercept() {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Intercept</h1>
        <Button onClick={() => router.push("/intercept/configure")}>
          Configure
        </Button>
      </div>

      <div className="grid grid-cols-3">
        <div className=""></div>
      </div>
    </>
  );
}
