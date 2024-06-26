import { Card, Typography } from "antd";

export default function Dashboard() {
  return (
    <Card>
      <Typography.Title level={3}>Command center</Typography.Title>
      <Typography.Paragraph type="secondary">
        Wire domain views under <code>src/views/</code> and register routes in <code>src/router</code>.
      </Typography.Paragraph>
    </Card>
  );
}
