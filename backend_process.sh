cd /opt/app-root/src/
# Start the first process
npm run dev &

cd /opt/app-root/src/AR-app
# Start the second process
npm start &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
echo $?