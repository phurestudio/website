import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin login | Phure Studios",
};

export default function AdminLoginPage() {
  return (
    <div className="section" style={{ justifyItems: "center" }}>
      <LoginForm />
    </div>
  );
}
