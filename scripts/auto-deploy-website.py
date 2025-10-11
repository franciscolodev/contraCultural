import os
import shutil
import subprocess

branch_name = 'desarrollador'

def run_cmd(cmd, cwd=None):
    print(f"👉 Ejecutando comando: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if result.returncode != 0:
        print("❌ FALLO!")
        exit(1)

def main():
    # 1. Eliminar el directorio website
    website_dir = os.path.join(os.getcwd(), "website")
    if os.path.exists(website_dir):
        print("🧹 Eliminar el directorio...")
        shutil.rmtree(website_dir)

    # 2. git clone docs website 
    repo_url = "https://github.com/franciscolodev/contraCultural.git"
    print("📥 Clonando la rama blog en el directorio website...")
    run_cmd(f"git clone --depth 1 -b {branch_name} {repo_url} website")

    site_dir = os.path.join(os.getcwd(), "dist")
    if not os.path.exists(site_dir):
        print("❌ Error: El directorio dist no existe.")
        exit(1)

    print("📋 Copiando el contenido de dist al directorio website...")
    for item in os.listdir(site_dir):
        s = os.path.join(site_dir, item)
        d = os.path.join(website_dir, item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(s, d)
        else:
            shutil.copy2(s, d)

    # 4. Ejecute git push en el directorio
    print("🚀 Prepárese para enviar al repositorio remoto....")
    run_cmd("git add .", cwd=website_dir)
    run_cmd('git commit -m "Actualizar automáticamente el contenido"', cwd=website_dir)
    run_cmd("git push", cwd=website_dir)

    print("✅ ¡Todo completo!")

if __name__ == "__main__":
    main()



