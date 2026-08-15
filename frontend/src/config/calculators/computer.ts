import { createDisciplineCalculatorsCatalog } from "./createCalculatorEntry";

export const computerCalculatorsCatalog = createDisciplineCalculatorsCatalog(
  "computer-engineering",
  "Computer Engineering",
  [
    {
      name: "Storage Calculator",
      category: "Storage",
      description:
        "Disk capacity planning for databases, logs, and application data.",
      isPopular: true,
    },
    {
      name: "Network Bandwidth",
      category: "Networking",
      description:
        "Bandwidth requirements for data transfer and streaming workloads.",
      isPopular: true,
    },
    {
      name: "CPU Load",
      category: "Performance",
      description:
        "CPU utilization and capacity planning for server workloads.",
      isPopular: true,
    },
    {
      name: "RAID Capacity",
      category: "Storage",
      description:
        "Usable storage capacity across RAID levels and drive configurations.",
    },
    {
      name: "Memory Usage",
      category: "Performance",
      description:
        "RAM sizing and memory footprint estimation for applications and VMs.",
    },
  ]
);
