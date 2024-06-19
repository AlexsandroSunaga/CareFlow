import { Button, Card, List } from "antd";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";

const catalog = [
  { id: "cms-quality", name: "CMS quality measures", cadence: "Monthly", owner: "Quality office" },
  { id: "phi-access", name: "PHI access summary", cadence: "Weekly", owner: "Compliance" },
  { id: "denials", name: "Claim denials & appeals", cadence: "Daily", owner: "Revenue cycle" },
  { id: "throughput", name: "ED & inpatient throughput", cadence: "Shift", owner: "Operations" },
];

export default function ConsoleReportsPage() {
  return (
    <ModuleWorkbench
      title="Report catalog"
      subtitle="Scheduled exports, break-glass attestations, and regulatory packets."
      actions={<Button type="primary">New scheduled report</Button>}
    >
      <Card>
        <List
          dataSource={catalog}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="run" size="small">Run now</Button>,
                <Button key="sub" size="small" type="link">Subscribers</Button>,
              ]}
            >
              <List.Item.Meta title={item.name} description={`${item.cadence} · ${item.owner}`} />
            </List.Item>
          )}
        />
      </Card>
    </ModuleWorkbench>
  );
}
