export default function ReportViewer({ report }: { report: any }) {
  return (
    <pre className="p-4 bg-gray-900 rounded-xl text-xs overflow-auto">
      {JSON.stringify(report, null, 2)}
    </pre>
  );
}
