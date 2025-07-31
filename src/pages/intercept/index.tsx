import Button from "@/components/ui/Button";
import useRouter from "@/store/router";

export default function Intercept() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <h1>Intercept</h1>
      <Button onClick={() => router.push("/intercept/configure")}>
        Configure
      </Button>
    </div>
  );
}
