import csv
import subprocess


def bash(
	command: str,
	cwd: str = None,
	exception = Exception
):
	"""Run a command in bash shell, and return stdout and stderr
	:param command: the command to run
	:param cwd: directory where to run the command (defaults to current dir)
	:param exception: class to use to raise exceptions (defaults to 'Exception')
	:return: stdout and stderr of the command
	:raises: exception (see above) if command exit code != 0
	"""
	out = subprocess.run(
		command,
		shell=True,
		executable="/bin/bash",
		cwd=cwd,
		stdout=subprocess.PIPE,
		stderr=subprocess.PIPE,
	)
	stdout = out.stdout.decode()
	stderr = out.stderr.decode()
	if out.returncode != 0:
		raise exception(
			f"Command '{command}' failed. Output is:\n"
			f"{stdout}\n{stderr}"
		)
	return stdout, stderr

with open("../ios/issues2.csv") as f:
    data = list(csv.reader(f, delimiter='\t'))

keys = data[0]

for r in data[1:]:
    title = r[0].strip()
    body = r[1].strip()

    out, err = bash(f'gh issue create --project "Dimension" --label "enhancement" --title "{title}" --body "{body}"')

    print(out, err)
