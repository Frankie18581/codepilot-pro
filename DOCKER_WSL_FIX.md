# Docker & WSL 2 网络连通性修复指南 (针对 SSTap & IPv6 问题)

如果你在使用 SSTap 时遇到 WSL 2 崩溃、死机或 Docker 无法拉取镜像，请按照以下步骤操作：

## 1. 开启 WSL 2 "镜像网络模式" (Mirrored Mode)
这是解决 WSL 2 与宿主机代理软件冲突的最稳定方案。它允许 WSL 2 直接共享宿主机的网络接口。

**操作步骤：**
1. 在 Windows 中按下 `Win + R`，输入 `%USERPROFILE%` 并回车。
2. 找到（或新建）一个名为 `.wslconfig` 的文件。
3. 将以下内容粘贴进去：

```ini
[wsl2]
# 开启镜像网络模式
networkingMode=mirrored
# 自动同步宿主机的代理设置
autoProxy=true
# 禁用 IPv6 (解决 docker.io 解析失败问题)
ipv6=false
# 允许从 WSL 2 访问 Windows 上的服务 (如 SSTap)
localhostForwarding=true

[experimental]
# 进一步增强网络兼容性
sparseVhd=true
```

4. 保存文件，然后在 CMD 中执行 `wsl --shutdown` 重启 WSL。

---

## 2. 配置 Docker Desktop 代理 (核心修复)
Docker Pull 镜像是由 Docker 守护进程执行的，它不一定遵循系统的环境变量。

**操作步骤：**
1. 打开 **Docker Desktop** 设置 (齿轮图标)。
2. 进入 **Resources -> Proxies**。
3. 开启 **Manual proxy configuration**。
4. 设置代理：
   - **方案 A (最稳)**: Web Server (HTTP): `http://host.docker.internal:28856`
   - **方案 B**: `http://10.22.6.82:28856` (你刚才查到的 IP)。
5. **重要排查 (解决 "拒绝连接/超时" 报错)**:
   - **SSTap 核心设置**: 进入 SSTap 的 **设置**，勾选 **“允许局域网连接” (Allow LAN connection)**。如果没有勾选，SSTap 只会监听 `127.0.0.1`，从而拒绝来自 Docker 虚拟机 (192.168.0.x) 的所有连接。
   - **Windows 防火墙**: 你的报错 `connectex: A connection attempt failed...` 表明包发过去了但没回音。请尝试：
     - 在 Windows 防火墙中为 `28856` 端口添加入站规则，允许所有连接。
     - 或者**临时关闭** Windows 防火墙测试一下（如果成功，说明就是防火墙在挡）。
6. 点击 **Apply & Restart**。

---

## 3. 常见问题排查 (FAQ)

### 为什么我已经改了 Dockerfile，但启动还是报 Node.js 18 错误？
因为你的 `docker compose build` **失败了**。
- 当构建失败时，Docker **不会更新镜像**。
- `docker compose up` 此时会直接使用本地缓存的**旧镜像**（也就是之前那个 Node 18 的版本）。
- **解决方法**: 只有当 `docker compose build` 成功拉取到 `node:20-alpine` 镜像并完成构建，报错才会消失。

### 如果代理死活配不通怎么办？(备选方案)
如果 SSTap 代理一直报超时，可以尝试使用 **Docker 镜像加速器** (国内直连) 而不是代理：
1. 打开 Docker Desktop -> **Settings -> Docker Engine**。
2. 在 JSON 中加入（或修改）`registry-mirrors`：
   ```json
   {
     "registry-mirrors": [
       "https://docker.m.daocloud.io",
       "https://hub-mirror.c.163.com",
       "https://mirror.baidubce.com"
     ]
   }
   ```
3. 点击 **Apply & Restart**，然后关闭刚才配的 **Proxies** 代理。
- **docker-compose.yml**: 增加了 `build_args`，确保 `npm install` 和 `pip install` 阶段能走代理。

---

### 为什么报 Tailwind Oxide 原生二进制错误？
这是跨平台开发中最常见的陷阱：你在 Windows 下生成的 `.next` 缓存和 `node_modules` 包含的是 Windows 版的二进制文件，它们被挂载进 Linux 容器后，会导致架构不匹配。

**解决方案**:
1. 我们已在 `docker-compose.yml` 中增加了对 `/app/.next` 的**匿名挂载**，这会隐藏宿主机的缓存，强制容器使用自己的 Linux 版编译产物。
2. **极力建议**: 在 Windows 宿主机的 `frontend` 文件夹下，手动删除 `node_modules` 和 `.next` 文件夹，彻底清理环境。

---

## 4. 验证方案
在完成上述步骤后，请务必使用以下命令重新构建（跳过缓存）：
```bash
# 1. 删除旧容器
docker compose down
# 2. 强制重新构建并清除旧镜像层
docker compose build --no-cache
# 3. 启动
docker compose up
```

**为什么这能避坑？**
- **不再需要 SSTap "全局模式"**：Mirrored 模式配合 `autoProxy=true` 会自动路由流量。
- **不再死机**：避免了 Windows 虚拟网卡驱动与 SSTap 内核驱动的底层冲突。
- **解决 IPv6 阻断**：显式在 `.wslconfig` 中关闭了 IPv6 解析。
