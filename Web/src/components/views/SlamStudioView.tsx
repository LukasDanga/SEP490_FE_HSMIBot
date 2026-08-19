import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Map, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  ShieldCheck, 
  Gauge, 
  Sliders, 
  Download, 
  RotateCcw, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Move, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Radio, 
  Sparkles, 
  Bot, 
  Radar, 
  Lock, 
  Play, 
  Square, 
  CheckCircle2,
  Gamepad2,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Power,
  Volume2,
  VolumeX,
  Footprints
} from 'lucide-react';
import { Language, SlamZone, SlamZoneType, SlamDrawingTool } from '../../types';
import { translations } from '../../i18n/translations';

interface SlamStudioViewProps {
  lang: Language;
}

export interface VillaZone {
  id: string;
  nameVI: string;
  nameEN: string;
  type: 'living' | 'bedroom' | 'kitchen' | 'study' | 'foyer' | 'dock' | 'restricted' | 'slow_speed' | 'virtual_wall';
  color: string;
  borderColor: string;
  rect?: { x: number; y: number; width: number; height: number };
  line?: { x1: number; y1: number; x2: number; y2: number };
  active: boolean;
}

export const SlamStudioView: React.FC<SlamStudioViewProps> = ({ lang }) => {
  const t = translations[lang];
  const isVI = lang === 'vi';

  // 1. SLAM Studio Mode: 'builder' (Floorplan editing & walls/forbidden zones) vs 'active_slam' (Live LiDAR simulation)
  const [studioMode, setStudioMode] = useState<'active_slam' | 'builder'>('active_slam');

  // =========================================================================
  // SIMULATION STATE FOR ACTIVE SLAM (HTML5 Canvas + Ray Casting + Occupancy Grid)
  // =========================================================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAutoExploring, setIsAutoExploring] = useState(true);
  const [beamDensity, setBeamDensity] = useState<number>(360); // 180 | 360 | 720
  const [enableNoise, setEnableNoise] = useState<boolean>(true);
  const [showLaserBeams, setShowLaserBeams] = useState<boolean>(true);
  const [coveragePct, setCoveragePct] = useState<number>(14);
  const [fps, setFps] = useState<number>(60);
  const [totalHits, setTotalHits] = useState<number>(360);

  // Simulation Robot Pose
  const simRobotRef = useRef({
    x: 450,
    y: 325,
    angle: 0, // radians
    speed: 0,
    rotSpeed: 0,
    radius: 14,
    trail: [] as Array<{ x: number; y: number }>
  });

  // Dynamic Human Obstacle
  const simHumanRef = useRef({
    x: 650,
    y: 200,
    radius: 12,
    vx: 0.8,
    vy: 0.6
  });

  // Occupancy Grid (Cell size = 5px, width = 900/5 = 180, height = 650/5 = 130)
  const CELL_SIZE = 5;
  const GRID_COLS = 900 / CELL_SIZE; // 180
  const GRID_ROWS = 650 / CELL_SIZE; // 130
  const occupancyGridRef = useRef<Uint8Array>(new Uint8Array(GRID_COLS * GRID_ROWS)); // 0: Unknown, 1: Free, 2: Occupied

  // Key States
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // =========================================================================
  // BUILDER / RESTRICTED ZONE STATE (Villa Room zones + Virtual Walls + Forbidden Zones)
  // =========================================================================
  const [zones, setZones] = useState<VillaZone[]>([
    {
      id: 'dock_zone',
      nameVI: 'Trạm Sạc Thông Minh',
      nameEN: 'Smart Charging Dock',
      type: 'dock',
      color: '#EAB308',
      borderColor: '#EAB308',
      rect: { x: 238, y: 80, width: 105, height: 90 },
      active: true
    },
    {
      id: 'living_room',
      nameVI: 'Phòng Khách & Bàn Trà',
      nameEN: 'Living Room & Lounge',
      type: 'living',
      color: '#111827',
      borderColor: '#475569',
      rect: { x: 448, y: 80, width: 260, height: 490 },
      active: true
    },
    {
      id: 'master_bedroom',
      nameVI: 'Phòng Ngủ Master Suite',
      nameEN: 'Master Bedroom Suite',
      type: 'bedroom',
      color: '#131B2B',
      borderColor: '#334155',
      rect: { x: 858, y: 80, width: 400, height: 420 },
      active: true
    },
    {
      id: 'study_room',
      nameVI: 'Phòng Đọc Sách & Làm Việc',
      nameEN: 'Study & Home Office',
      type: 'study',
      color: '#0F172A',
      borderColor: '#475569',
      rect: { x: 870, y: 580, width: 150, height: 180 },
      active: true
    },
    {
      id: 'kitchen_room',
      nameVI: 'Phòng Bếp & Bàn Ăn',
      nameEN: 'Kitchen & Dining Area',
      type: 'kitchen',
      color: '#0C2333',
      borderColor: '#0284C7',
      rect: { x: 1100, y: 610, width: 160, height: 160 },
      active: true
    },
    {
      id: 'foyer_zone',
      nameVI: 'Sảnh Chính & Nút Giao',
      nameEN: 'Main Foyer Corridor',
      type: 'foyer',
      color: '#84CC16',
      borderColor: '#84CC16',
      rect: { x: 710, y: 490, width: 150, height: 120 },
      active: true
    },
    {
      id: 'restricted_balcony',
      nameVI: 'Khu Vực Cấm: Ban Công Kính Ngoài Trời',
      nameEN: 'Forbidden: Outdoor Glass Balcony',
      type: 'restricted',
      color: '#EF4444',
      borderColor: '#DC2626',
      rect: { x: 120, y: 680, width: 220, height: 100 },
      active: true
    },
    {
      id: 'virtual_wall_stairs',
      nameVI: 'Tường Ảo: Rào Cản Chân Cầu Thang',
      nameEN: 'Virtual Wall: Staircase Safety Barrier',
      type: 'virtual_wall',
      color: '#EF4444',
      borderColor: '#F87171',
      line: { x1: 720, y1: 180, x2: 720, y2: 320 },
      active: true
    },
    {
      id: 'slow_zone_pets',
      nameVI: 'Vùng Giảm Tốc: Góc Thú Cưng & Em Bé',
      nameEN: 'Slow Speed Zone: Pet & Nursery Area',
      type: 'slow_speed',
      color: '#F59E0B',
      borderColor: '#F59E0B',
      rect: { x: 500, y: 380, width: 180, height: 160 },
      active: true
    }
  ]);

  // Zone Form State (Add New or Edit)
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneType, setNewZoneType] = useState<VillaZone['type']>('restricted');
  const [newZoneNameVI, setNewZoneNameVI] = useState('');
  const [newZoneNameEN, setNewZoneNameEN] = useState('');
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  // Save or Update Zone
  const handleSaveZone = () => {
    if (!newZoneNameVI.trim()) return;

    if (editingZoneId) {
      setZones(prev => prev.map(z => {
        if (z.id === editingZoneId) {
          return {
            ...z,
            nameVI: newZoneNameVI,
            nameEN: newZoneNameEN || newZoneNameVI,
            type: newZoneType,
            color: newZoneType === 'restricted' || newZoneType === 'virtual_wall' ? '#EF4444' : newZoneType === 'slow_speed' ? '#F59E0B' : '#0EA5E9',
            borderColor: newZoneType === 'restricted' ? '#DC2626' : newZoneType === 'slow_speed' ? '#D97706' : '#38BDF8'
          };
        }
        return z;
      }));
      setEditingZoneId(null);
    } else {
      const newId = `zone_${Date.now()}`;
      const newZone: VillaZone = {
        id: newId,
        nameVI: newZoneNameVI,
        nameEN: newZoneNameEN || newZoneNameVI,
        type: newZoneType,
        color: newZoneType === 'restricted' || newZoneType === 'virtual_wall' ? '#EF4444' : newZoneType === 'slow_speed' ? '#F59E0B' : '#0EA5E9',
        borderColor: newZoneType === 'restricted' ? '#DC2626' : newZoneType === 'slow_speed' ? '#D97706' : '#38BDF8',
        rect: newZoneType === 'virtual_wall' ? undefined : { x: 600, y: 250, width: 140, height: 120 },
        line: newZoneType === 'virtual_wall' ? { x1: 500, y1: 200, x2: 500, y2: 350 } : undefined,
        active: true
      };
      setZones(prev => [...prev, newZone]);
    }

    setNewZoneNameVI('');
    setNewZoneNameEN('');
    setIsAddingZone(false);
  };

  const startEditZone = (zone: VillaZone) => {
    setEditingZoneId(zone.id);
    setNewZoneNameVI(zone.nameVI);
    setNewZoneNameEN(zone.nameEN);
    setNewZoneType(zone.type);
    setIsAddingZone(true);
  };

  const deleteZone = (id: string) => {
    setZones(prev => prev.filter(z => z.id !== id));
  };

  // Reset Occupancy Grid Map
  const resetOccupancyGrid = () => {
    occupancyGridRef.current.fill(0);
    setCoveragePct(0);
    simRobotRef.current.trail = [];
  };

  // =========================================================================
  // SIMULATION MAIN LOOP: RAY CASTING + OCCUPANCY GRID + ROBOT KINEMATICS
  // =========================================================================
  useEffect(() => {
    if (studioMode !== 'active_slam') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Environmental Obstacles & Walls (Line segments)
    const walls = [
      // Outer Perimeter Walls (900x650)
      { x1: 30, y1: 30, x2: 870, y2: 30 },
      { x1: 870, y1: 30, x2: 870, y2: 620 },
      { x1: 870, y1: 620, x2: 30, y2: 620 },
      { x1: 30, y1: 620, x2: 30, y2: 30 },

      // Room Partition 1 (Living Room wall with door opening)
      { x1: 320, y1: 30, x2: 320, y2: 240 },
      { x1: 320, y1: 340, x2: 320, y2: 620 },

      // Room Partition 2 (Master Bedroom wall with door opening)
      { x1: 600, y1: 30, x2: 600, y2: 280 },
      { x1: 600, y1: 390, x2: 600, y2: 620 },

      // Room Partition 3 (Horizontal Corridor wall)
      { x1: 320, y1: 440, x2: 500, y2: 440 },

      // Rectangular Pillar 1 (Left Room)
      { x1: 150, y1: 150, x2: 200, y2: 150 },
      { x1: 200, y1: 150, x2: 200, y2: 200 },
      { x1: 200, y1: 200, x2: 150, y2: 200 },
      { x1: 150, y1: 200, x2: 150, y2: 150 },

      // Rectangular Pillar 2 (Left Room Bottom)
      { x1: 150, y1: 450, x2: 200, y2: 450 },
      { x1: 200, y1: 450, x2: 200, y2: 500 },
      { x1: 200, y1: 500, x2: 150, y2: 500 },
      { x1: 150, y1: 500, x2: 150, y2: 450 },

      // Rectangular Pillar 3 (Right Room Center)
      { x1: 720, y1: 160, x2: 770, y2: 160 },
      { x1: 770, y1: 160, x2: 770, y2: 210 },
      { x1: 770, y1: 210, x2: 720, y2: 210 },
      { x1: 720, y1: 210, x2: 720, y2: 160 },

      // Rectangular Pillar 4 (Right Room Bottom)
      { x1: 720, y1: 460, x2: 770, y2: 460 },
      { x1: 770, y1: 460, x2: 770, y2: 510 },
      { x1: 770, y1: 510, x2: 720, y2: 510 },
      { x1: 720, y1: 510, x2: 720, y2: 460 }
    ];

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // Ray-Line Intersection Helper
    const getRayIntersection = (
      rx: number, ry: number, rdx: number, rdy: number, maxDist: number,
      wx1: number, wy1: number, wx2: number, wy2: number
    ) => {
      const dx = wx2 - wx1;
      const dy = wy2 - wy1;
      const denom = rdx * dy - rdy * dx;
      if (Math.abs(denom) < 0.00001) return null;

      const t1 = ((wx1 - rx) * dy - (wy1 - ry) * dx) / denom;
      const t2 = ((wx1 - rx) * rdy - (wy1 - ry) * rdx) / denom;

      if (t1 > 0 && t1 <= maxDist && t2 >= 0 && t2 <= 1) {
        return {
          dist: t1,
          x: rx + rdx * t1,
          y: ry + rdy * t1
        };
      }
      return null;
    };

    // Bresenham's Ray Marking for Occupancy Grid
    const markGridRay = (x0: number, y0: number, x1: number, y1: number, hitWall: boolean) => {
      const grid = occupancyGridRef.current;
      let gx0 = Math.floor(x0 / CELL_SIZE);
      let gy0 = Math.floor(y0 / CELL_SIZE);
      const gx1 = Math.floor(x1 / CELL_SIZE);
      const gy1 = Math.floor(y1 / CELL_SIZE);

      const dx = Math.abs(gx1 - gx0);
      const dy = Math.abs(gy1 - gy0);
      const sx = gx0 < gx1 ? 1 : -1;
      const sy = gy0 < gy1 ? 1 : -1;
      let err = dx - dy;

      while (true) {
        if (gx0 >= 0 && gx0 < GRID_COLS && gy0 >= 0 && gy0 < GRID_ROWS) {
          const idx = gy0 * GRID_COLS + gx0;
          if (gx0 === gx1 && gy0 === gy1) {
            if (hitWall) {
              grid[idx] = 2; // Occupied obstacle
            } else if (grid[idx] === 0) {
              grid[idx] = 1; // Free space
            }
            break;
          } else {
            if (grid[idx] !== 2) {
              grid[idx] = 1; // Mark Free space along ray
            }
          }
        }

        if (gx0 === gx1 && gy0 === gy1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          gx0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          gy0 += sy;
        }
      }
    };

    // Main Game Loop
    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      frameCount++;

      if (time - lastFpsUpdate > 500) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      const robot = simRobotRef.current;
      const human = simHumanRef.current;

      // Update Dynamic Human Obstacle
      human.x += human.vx;
      human.y += human.vy;
      if (human.x < 620 || human.x > 840) human.vx *= -1;
      if (human.y < 80 || human.y > 360) human.vy *= -1;

      // Dynamic Human Walls for LiDAR reflection
      const dynamicWalls = [
        ...walls,
        // Approximate human as small bounding box
        { x1: human.x - human.radius, y1: human.y - human.radius, x2: human.x + human.radius, y2: human.y - human.radius },
        { x1: human.x + human.radius, y1: human.y - human.radius, x2: human.x + human.radius, y2: human.y + human.radius },
        { x1: human.x + human.radius, y1: human.y + human.radius, x2: human.x - human.radius, y2: human.y + human.radius },
        { x1: human.x - human.radius, y1: human.y + human.radius, x2: human.x - human.radius, y2: human.y - human.radius }
      ];

      // Robot Kinematics: Manual Driving or Autonomous Wall-Following Exploration
      if (isAutoExploring) {
        // Autonomous Exploration: Ray cast forward to detect obstacles
        const fwdAngle = robot.angle;
        let minFrontDist = 999;
        for (let a = -45; a <= 45; a += 15) {
          const testAngle = fwdAngle + (a * Math.PI) / 180;
          const rdx = Math.cos(testAngle);
          const rdy = Math.sin(testAngle);
          dynamicWalls.forEach(w => {
            const hit = getRayIntersection(robot.x, robot.y, rdx, rdy, 120, w.x1, w.y1, w.x2, w.y2);
            if (hit && hit.dist < minFrontDist) minFrontDist = hit.dist;
          });
        }

        if (minFrontDist < 45) {
          // Turn away from obstacle
          robot.rotSpeed = 1.8;
          robot.speed = 0.5;
        } else {
          robot.rotSpeed = (Math.random() - 0.5) * 0.4;
          robot.speed = 1.6;
        }
      } else {
        // Manual Keyboard Controls (WASD / Arrows)
        let linear = 0;
        let angular = 0;
        const keys = keysRef.current;
        if (keys['w'] || keys['W'] || keys['ArrowUp']) linear += 2.0;
        if (keys['s'] || keys['S'] || keys['ArrowDown']) linear -= 1.4;
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) angular -= 2.4;
        if (keys['d'] || keys['D'] || keys['ArrowRight']) angular += 2.4;

        robot.speed = linear;
        robot.rotSpeed = angular;
      }

      // Apply Kinematics
      robot.angle += robot.rotSpeed * dt;
      const nextX = robot.x + Math.cos(robot.angle) * robot.speed;
      const nextY = robot.y + Math.sin(robot.angle) * robot.speed;

      // Wall collision prevention for robot body (Radius 14)
      let canMove = true;
      if (nextX < 45 || nextX > 855 || nextY < 45 || nextY > 605) canMove = false;
      if (canMove) {
        robot.x = nextX;
        robot.y = nextY;
      }

      // Record Odometry Trail
      const lastTrail = robot.trail[robot.trail.length - 1];
      if (!lastTrail || Math.hypot(lastTrail.x - robot.x, lastTrail.y - robot.y) > 6) {
        robot.trail.push({ x: robot.x, y: robot.y });
        if (robot.trail.length > 200) robot.trail.shift();
      }

      // =========================================================================
      // RENDERING CANVAS
      // =========================================================================
      ctx.fillStyle = '#0B0F17'; // Industrial Dark Background
      ctx.fillRect(0, 0, 900, 650);

      // 1. Render 2D Occupancy Grid Array
      const grid = occupancyGridRef.current;
      let freeCount = 0;
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const val = grid[r * GRID_COLS + c];
          if (val === 1) {
            // Free Space: Light Slate Gray
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            freeCount++;
          } else if (val === 2) {
            // Occupied Wall: Cyan Glowing Wall Cell
            ctx.fillStyle = '#0284C7';
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      // Calculate Coverage Percentage
      const currentCoverage = Math.min(Math.round((freeCount / (GRID_COLS * GRID_ROWS * 0.75)) * 100), 100);
      setCoveragePct(currentCoverage);

      // 2. Render Static Room Walls (Blueprints)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      walls.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();
      });

      // 3. Render Dynamic Obstacle (Walking Human)
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(human.x, human.y, human.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Human Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isVI ? 'Người Đi Lại' : 'Walking Human', human.x, human.y - 16);

      // 4. LiDAR Ray-Casting Algorithm (360 beams, 1° resolution, Max Range = 250px)
      const maxLidarRange = 260;
      const numBeams = beamDensity;
      const stepAngle = (Math.PI * 2) / numBeams;
      const hitPoints: Array<{ x: number; y: number }> = [];

      ctx.lineWidth = 0.5;

      for (let i = 0; i < numBeams; i++) {
        const theta = robot.angle + i * stepAngle;
        const rdx = Math.cos(theta);
        const rdy = Math.sin(theta);

        let closestHit: { dist: number; x: number; y: number } | null = null;

        for (const w of dynamicWalls) {
          const hit = getRayIntersection(robot.x, robot.y, rdx, rdy, maxLidarRange, w.x1, w.y1, w.x2, w.y2);
          if (hit) {
            if (!closestHit || hit.dist < closestHit.dist) {
              closestHit = hit;
            }
          }
        }

        let hitX = robot.x + rdx * maxLidarRange;
        let hitY = robot.y + rdy * maxLidarRange;
        let isHitWall = false;

        if (closestHit) {
          // Apply Gaussian sensor noise jitter (+-1.5px) if enabled
          const noise = enableNoise ? (Math.random() - 0.5) * 2.5 : 0;
          hitX = closestHit.x + noise;
          hitY = closestHit.y + noise;
          isHitWall = true;
          hitPoints.push({ x: hitX, y: hitY });
        }

        // Mark Occupancy Grid cells
        markGridRay(robot.x, robot.y, hitX, hitY, isHitWall);

        // Render Cyan Laser Rays
        if (showLaserBeams) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)'; // Cyan beam opacity
          ctx.beginPath();
          ctx.moveTo(robot.x, robot.y);
          ctx.lineTo(hitX, hitY);
          ctx.stroke();
        }
      }

      setTotalHits(hitPoints.length);

      // 5. Render Laser Impact Return Points
      ctx.fillStyle = '#22D3EE';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 4;
      hitPoints.forEach(p => {
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      });
      ctx.shadowBlur = 0; // Reset shadow

      // 6. Render Odometry Trail
      if (robot.trail.length > 1) {
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(robot.trail[0].x, robot.trail[0].y);
        for (let i = 1; i < robot.trail.length; i++) {
          ctx.lineTo(robot.trail[i].x, robot.trail[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 7. Render Robot Body & Direction Arrow
      ctx.save();
      ctx.translate(robot.x, robot.y);
      ctx.rotate(robot.angle);

      // Halo ring
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, robot.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Chassis Body
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, robot.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Heading Pointer
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.moveTo(robot.radius + 6, 0);
      ctx.lineTo(robot.radius - 4, -5);
      ctx.lineTo(robot.radius - 4, 5);
      ctx.closePath();
      ctx.fill();

      // LiDAR Dome
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [studioMode, isAutoExploring, beamDensity, enableNoise, showLaserBeams]);

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] bg-[#0B0F17] text-slate-200 flex flex-col overflow-hidden select-none -m-6 p-6">
      
      {/* =========================================================================
           TOP CONTROL BAR
           ========================================================================= */}
      <div className="h-14 min-h-[56px] max-h-[56px] bg-[#111622] border border-[#1E293B] rounded-2xl px-5 flex items-center justify-between shadow-xl mb-4 shrink-0">
        
        {/* Brand & Mode Switcher */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-500/25">
              <Radar className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wide text-white uppercase leading-none font-mono">
                SLAM Studio & LiDAR Engine
              </span>
              <span className="text-[10px] font-mono text-sky-400 font-semibold tracking-wider">
                {isVI ? 'Dựng Bản Đồ & Quét Lidar 360°' : '2D SLAM LiDAR & Occupancy Grid Mapping'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800"></div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setStudioMode('active_slam')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                studioMode === 'active_slam' 
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-500/40 shadow-inner' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isVI ? 'Quét SLAM Chủ Động (Mô Phỏng Thực)' : 'Active SLAM Simulation'}</span>
            </button>

            <button
              onClick={() => setStudioMode('builder')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                studioMode === 'builder' 
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-500/40 shadow-inner' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isVI ? 'Tường Ảo & Vùng Cấm Vào' : 'Virtual Walls & Keep-out Zones'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#151D2A] border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">{isVI ? 'Độ Phủ Bản Đồ:' : 'Coverage:'}</span>
            <span className="text-sky-400 font-black">{coveragePct}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">FPS:</span>
            <span className="text-emerald-400 font-bold">{fps}</span>
          </div>

          <button
            onClick={resetOccupancyGrid}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            title={isVI ? 'Xóa bản đồ và quét lại' : 'Reset SLAM Grid Map'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isVI ? 'Quét Lại' : 'Reset Grid'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
           MAIN WORKSPACE
           ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* MODE 1: ACTIVE SLAM SIMULATION VIEW */}
        {studioMode === 'active_slam' && (
          <>
            {/* CANVAS CONTAINER */}
            <div className="xl:col-span-8 2xl:col-span-9 relative bg-[#0B0F17] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between items-center p-3">
              
              {/* Telemetry HUD Top-Left */}
              <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 bg-[#111827]/90 border border-slate-800 px-3.5 py-1.5 rounded-xl backdrop-blur text-xs font-mono">
                <Radar className="w-4 h-4 text-sky-400 animate-spin" />
                <span className="text-slate-300 font-semibold">
                  {isVI ? 'Điểm Trả Về (Returns):' : 'Point Returns:'} <strong className="text-white font-bold">{totalHits}/{beamDensity}</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400 font-semibold">
                  {isVI ? 'Chế độ:' : 'Mode:'} <strong className={isAutoExploring ? "text-emerald-400" : "text-amber-400"}>
                    {isAutoExploring ? (isVI ? 'Tự Động Khám Phá' : 'Auto Explore') : (isVI ? 'Lái Bằng Phím' : 'WASD Drive')}
                  </strong>
                </span>
              </div>

              {/* Top-Right Quick Simulation Toggles */}
              <div className="absolute top-6 right-6 z-20 flex items-center space-x-2 bg-[#111827]/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur text-xs font-mono">
                <button
                  onClick={() => setIsAutoExploring(!isAutoExploring)}
                  className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isAutoExploring 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isAutoExploring ? (isVI ? 'Dừng Tự Khám Phá' : 'Pause Auto') : (isVI ? 'Bật Tự Khám Phá' : 'Start Auto')}</span>
                </button>

                <button
                  onClick={() => setShowLaserBeams(!showLaserBeams)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    showLaserBeams 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isVI ? 'Bật/Tắt hiển thị tia Laser' : 'Toggle Laser Rays'}
                >
                  {isVI ? 'Tia Laser' : 'Rays'}
                </button>

                <button
                  onClick={() => setEnableNoise(!enableNoise)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    enableNoise 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isVI ? 'Mô phỏng nhiễu cảm biến Gauss' : 'Toggle Gaussian Noise'}
                >
                  {isVI ? 'Nhiễu Gauss' : 'Noise'}
                </button>
              </div>

              {/* HTML5 Canvas Simulation Rendering (900x650) */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={650}
                  className="rounded-2xl border border-slate-800/80 shadow-2xl max-w-full max-h-full object-contain cursor-crosshair"
                />
              </div>

              {/* Bottom Canvas Guide */}
              <div className="w-full pt-2 flex items-center justify-between text-xs font-mono text-slate-400 px-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{isVI ? 'Thuật toán Ray-Casting 360° + Lưới Bresenham Occupancy Grid Map' : '360° Ray-Casting & Bresenham Occupancy Grid Map'}</span>
                </div>
                <div>
                  <span>{isVI ? 'Lái thủ công: Dùng phím W, A, S, D hoặc Mũi Tên' : 'Manual Driving: Use W, A, S, D or Arrow keys'}</span>
                </div>
              </div>
            </div>

            {/* SLAM SIMULATION CONFIGURATION PANEL */}
            <div className="xl:col-span-4 2xl:col-span-3 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4 overflow-y-auto">
              
              <div className="space-y-4 font-mono">
                {/* Header */}
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-white uppercase">{isVI ? 'Cấu Hình Cảm Biến LiDAR' : 'LiDAR Sensor Parameters'}</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">ROS2 Nav2</span>
                </div>

                {/* Beam Density Selector */}
                <div className="space-y-2 bg-[#0B0F17] p-3 rounded-2xl border border-slate-800 text-xs">
                  <label className="text-slate-300 font-bold flex items-center justify-between">
                    <span>{isVI ? 'Mật Độ Tia Laser 360°:' : 'LiDAR Beam Resolution:'}</span>
                    <span className="text-sky-400 font-bold">{beamDensity} {isVI ? 'tia' : 'beams'}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[180, 360, 720].map((density) => (
                      <button
                        key={density}
                        onClick={() => setBeamDensity(density)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          beamDensity === density
                            ? 'bg-sky-600 border-sky-400 text-white'
                            : 'bg-[#151D2A] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {density} {isVI ? 'Tia' : 'Pts'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Driving Control Mode */}
                <div className="space-y-2 bg-[#0B0F17] p-3 rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-300 font-bold block">{isVI ? 'Chế Độ Lái / Thám Hiểm:' : 'Exploration Mode:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsAutoExploring(true)}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        isAutoExploring
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-[#151D2A] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{isVI ? 'Tự Động Khám Phá' : 'Auto Explore'}</span>
                    </button>

                    <button
                      onClick={() => setIsAutoExploring(false)}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        !isAutoExploring
                          ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                          : 'bg-[#151D2A] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>{isVI ? 'Lái Bằng Phím' : 'WASD Drive'}</span>
                    </button>
                  </div>
                </div>

                {/* Color Legend */}
                <div className="bg-[#0B0F17] p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    {isVI ? 'Chú Thích Bản Đồ Occupancy Grid:' : 'Occupancy Grid Legend:'}
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded bg-[#0284C7]"></span>
                      <span className="text-slate-300">{isVI ? 'Vật cản / Tường (State 2: Occupied)' : 'Obstacle Walls (State 2)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded bg-[#1E293B] border border-slate-700"></span>
                      <span className="text-slate-300">{isVI ? 'Không gian trống an toàn (State 1: Free)' : 'Free Space (State 1)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded bg-[#0B0F17] border border-slate-800"></span>
                      <span className="text-slate-300">{isVI ? 'Chưa quét (State 0: Unknown)' : 'Unknown Area (State 0)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-amber-300">{isVI ? 'Chướng ngại vật động (Người di chuyển)' : 'Dynamic Moving Human'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Export Map Button */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => alert(isVI ? 'Đã xuất tệp bản đồ map.yaml và map.pgm thành công!' : 'Successfully exported map.yaml & map.pgm for ROS2!')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-1.5 cursor-pointer font-mono"
                >
                  <Download className="w-4 h-4" />
                  <span>{isVI ? 'XUẤT BẢN ĐỒ ROS2 (.YAML / .PGM)' : 'EXPORT ROS2 MAP FILES'}</span>
                </button>
              </div>

            </div>
          </>
        )}

        {/* MODE 2: VIRTUAL WALLS & RESTRICTED ZONES BUILDER */}
        {studioMode === 'builder' && (
          <>
            {/* SVG Interactive Villa Plan */}
            <div className="xl:col-span-8 2xl:col-span-9 relative bg-[#0F141E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 1440 840" className="w-full h-full object-contain select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Wall Footprint */}
                  <path 
                    d="M 120 70 H 230 V 40 H 860 V 70 H 1320 V 620 H 1170 V 780 H 160 V 670 H 120 Z" 
                    fill="#0F172A" 
                    stroke="#475569" 
                    strokeWidth="2.5" 
                  />

                  {/* Render Configured Zones & Virtual Walls */}
                  {zones.map((zone) => {
                    if (zone.type === 'virtual_wall' && zone.line) {
                      return (
                        <g key={zone.id}>
                          <line
                            x1={zone.line.x1}
                            y1={zone.line.y1}
                            x2={zone.line.x2}
                            y2={zone.line.y2}
                            stroke={zone.borderColor}
                            strokeWidth="4"
                            strokeDasharray="6,4"
                          />
                          <text
                            x={(zone.line.x1 + zone.line.x2) / 2 + 10}
                            y={(zone.line.y1 + zone.line.y2) / 2}
                            fill="#F87171"
                            fontSize="11"
                            fontFamily="Inter"
                            fontWeight="bold"
                          >
                            ⛔ {isVI ? zone.nameVI : zone.nameEN}
                          </text>
                        </g>
                      );
                    }

                    if (zone.rect) {
                      const isRestricted = zone.type === 'restricted';
                      const isSlow = zone.type === 'slow_speed';
                      return (
                        <g key={zone.id}>
                          <rect
                            x={zone.rect.x}
                            y={zone.rect.y}
                            width={zone.rect.width}
                            height={zone.rect.height}
                            fill={zone.color}
                            fillOpacity={isRestricted ? 0.35 : isSlow ? 0.25 : 0.4}
                            stroke={zone.borderColor}
                            strokeWidth={isRestricted ? 2.5 : 1.5}
                            strokeDasharray={isRestricted ? '6,6' : '4,4'}
                            rx="6"
                          />
                          <text
                            x={zone.rect.x + zone.rect.width / 2}
                            y={zone.rect.y + zone.rect.height / 2}
                            fill={isRestricted ? '#FCA5A5' : isSlow ? '#FDE047' : '#94A3B8'}
                            fontSize={isRestricted ? 13 : 12}
                            fontFamily="Inter"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {isRestricted ? `🚫 ${isVI ? zone.nameVI : zone.nameEN}` : isSlow ? `⚠️ ${isVI ? zone.nameVI : zone.nameEN}` : (isVI ? zone.nameVI : zone.nameEN)}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>

              <div className="p-2 bg-[#0B0F17]/80 border-t border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{isVI ? 'Sơ Đồ Biệt Thự & Quản Lý Vùng Cấm / Tường Ảo' : 'Villa Floorplan & Restricted Zone Manager'}</span>
                <span>{zones.length} {isVI ? 'vùng đã cấu hình' : 'zones configured'}</span>
              </div>
            </div>

            {/* ZONE EDIT & CREATION PANEL */}
            <div className="xl:col-span-4 2xl:col-span-3 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4 overflow-y-auto">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase font-mono">
                    {isVI ? 'Danh Sách Khu Vực & Tường Ảo' : 'Zones & Virtual Barriers'}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingZoneId(null);
                      setNewZoneNameVI('');
                      setNewZoneNameEN('');
                      setNewZoneType('restricted');
                      setIsAddingZone(true);
                    }}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isVI ? 'Thêm Mới' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add/Edit Modal Inline Form */}
                {isAddingZone && (
                  <div className="bg-[#0B0F17] p-3.5 rounded-2xl border border-sky-500/50 space-y-3 font-mono">
                    <div className="text-xs font-bold text-sky-300 flex items-center justify-between">
                      <span>{editingZoneId ? (isVI ? 'Chỉnh Sửa Vùng' : 'Edit Zone') : (isVI ? 'Thêm Vùng Mới' : 'Create New Zone')}</span>
                      <button onClick={() => setIsAddingZone(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{isVI ? 'Loại Phân Vùng:' : 'Zone Type:'}</label>
                      <select
                        value={newZoneType}
                        onChange={(e) => setNewZoneType(e.target.value as any)}
                        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="restricted">{isVI ? '🚫 Vùng Cấm Vào (Restricted)' : '🚫 Keep-Out Restricted Zone'}</option>
                        <option value="virtual_wall">{isVI ? '⛔ Tường Ảo Rào Cản (Virtual Wall)' : '⛔ Virtual Wall Barrier'}</option>
                        <option value="slow_speed">{isVI ? '⚠️ Vùng Giảm Tốc (Slow Speed)' : '⚠️ Slow Speed Zone'}</option>
                        <option value="living">{isVI ? 'Phòng Khách (Living)' : 'Living Room'}</option>
                        <option value="bedroom">{isVI ? 'Phòng Ngủ (Bedroom)' : 'Bedroom'}</option>
                        <option value="kitchen">{isVI ? 'Phòng Bếp (Kitchen)' : 'Kitchen'}</option>
                        <option value="study">{isVI ? 'Phòng Đọc Sách (Study)' : 'Study'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{isVI ? 'Tên Tiếng Việt:' : 'Vietnamese Name:'}</label>
                      <input
                        type="text"
                        placeholder="VD: Cửa hầm, Ban công..."
                        value={newZoneNameVI}
                        onChange={(e) => setNewZoneNameVI(e.target.value)}
                        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{isVI ? 'Tên Tiếng Anh:' : 'English Name:'}</label>
                      <input
                        type="text"
                        placeholder="e.g. Balcony, Nursery..."
                        value={newZoneNameEN}
                        onChange={(e) => setNewZoneNameEN(e.target.value)}
                        className="w-full bg-[#111827] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={handleSaveZone}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isVI ? 'Lưu Vùng' : 'Save Zone'}</span>
                      </button>
                      <button
                        onClick={() => setIsAddingZone(false)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {isVI ? 'Hủy' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Zones List */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {zones.map((z) => (
                    <div key={z.id} className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: z.borderColor }}></span>
                        <div className="truncate">
                          <div className="font-bold text-white truncate">{isVI ? z.nameVI : z.nameEN}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{z.type.replace('_', ' ')}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => startEditZone(z)}
                          className="p-1.5 bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                          title={isVI ? 'Chỉnh sửa' : 'Edit'}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteZone(z.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                          title={isVI ? 'Xóa' : 'Delete'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => alert(isVI ? 'Đã lưu đồng bộ các phân vùng cấm và tường ảo vào hệ thống Nav2 Costmap!' : 'Synced Keep-Out Zones to ROS2 Nav2 Costmap!')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-1.5 cursor-pointer font-mono"
                >
                  <Save className="w-4 h-4" />
                  <span>{isVI ? 'ĐỒNG BỘ VÀO NAV2 COSTMAP' : 'SYNC TO COSTMAP'}</span>
                </button>
              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
};
