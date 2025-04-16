import { Card } from "@/components/ui/card";

export default function MemberCard({ member }) {
  return (
    <Card className="p-4 hover:shadow-md transition rounded-2xl">
      <div className="text-lg font-semibold text-[#0F2C59]">{member.name}</div>
      <div className="text-sm text-gray-500">Elevated: {member.elevationYear}</div>
      {/* Later: link to detail page or modal */}
    </Card>
  );
}
